import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('mydb24cntt1a.db');
  return db;
};

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
};

export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

export type CartItem = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  name?: string;
  price?: number;
  img?: string;
};

export type Order = {
  id: number;
  userId: number;
  totalPrice: number;
  orderDate: string;
  status: string;
  address: string;
  phone: string;
  username?: string;
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  productName?: string;
};

const initialCategories: Category[] = [
  { id: 1, name: 'Máy ảnh' },
  { id: 2, name: 'Ống kính' },
  { id: 3, name: 'Phụ kiện' },
  { id: 4, name: 'Balo - Túi' },
  { id: 5, name: 'Flycam' },
];

const initialProducts: Omit<Product, 'id'>[] = [
  // Máy ảnh
  { name: 'Sony Alpha A7 IV Mirrorless', price: 54990000, img: 'camera_sony_a7iv.jpg', categoryId: 1 },
  { name: 'Canon EOS R6 Mark II', price: 62000000, img: 'camera_canon_r6.jpg', categoryId: 1 },
  { name: 'Fujifilm X-T5 Body', price: 41990000, img: 'camera_fuji_xt5.jpg', categoryId: 1 },
  { name: 'Nikon Z6 III Body', price: 58500000, img: 'camera_nikon_z6.jpg', categoryId: 1 },
  // Ống kính
  { name: 'Sony FE 24-70mm f/2.8 GM II', price: 49990000, img: 'lens_sony_gm.jpg', categoryId: 2 },
  { name: 'Canon RF 50mm f/1.2L USM', price: 34500000, img: 'lens_canon.jpg', categoryId: 2 },
  { name: 'Nikon Z 85mm f/1.8 S', price: 16990000, img: 'lens_nikon.jpg', categoryId: 2 },
  // Phụ kiện
  { name: 'Thẻ nhớ SanDisk Extreme Pro 128GB', price: 850000, img: 'accessory_sdcard.jpg', categoryId: 3 },
  { name: 'Chân máy Tripod Joby GorillaPod 5K', price: 2490000, img: 'accessory_tripod.jpg', categoryId: 3 },
  { name: 'Filter Kính B+W 77mm MRC Nano', price: 1890000, img: 'accessory_filter.jpg', categoryId: 3 },
  { name: 'Flash Godox V1 Pro TTL', price: 4290000, img: 'accessory_flash.jpg', categoryId: 3 },
  // Balo - Túi
  { name: 'Balo Peak Design Everyday 20L', price: 6500000, img: 'bag_peak_design.jpg', categoryId: 4 },
  { name: 'Balo Lowepro ProTactic 450 AW II', price: 5290000, img: 'bag_lowepro.jpg', categoryId: 4 },
  // Flycam
  { name: 'DJI Mini 4 Pro Fly More Combo', price: 26290000, img: 'drone_dji_mini4.jpg', categoryId: 5 },
  { name: 'DJI Air 3 Drone', price: 21990000, img: 'drone_dji_air3.jpg', categoryId: 5 },
];

const initialUsers: Omit<User, 'id'>[] = [
  { username: 'admin', password: '123456', role: 'admin' },
  { username: 'user1', password: '123456', role: 'user' },
  { username: 'user2', password: '123456', role: 'user' },
];

export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  try {
    const database = await getDb();

    // Kích hoạt foreign keys và tạo các bảng
    await database.execAsync(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      );
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        img TEXT,
        categoryId INTEGER,
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      );
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        productId INTEGER,
        quantity INTEGER,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        totalPrice REAL,
        orderDate TEXT,
        status TEXT,
        address TEXT,
        phone TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER,
        productId INTEGER,
        quantity INTEGER,
        price REAL,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL
      );
    `);

    // Kiểm tra nếu sản phẩm đầu tiên dùng ảnh cũ (thời trang/hinh*.jpg), xóa để nạp lại
    try {
      const checkOldCat = await database.getFirstAsync<{ name: string }>('SELECT name FROM categories LIMIT 1');
      const checkOldImg = await database.getFirstAsync<{ img: string }>('SELECT img FROM products LIMIT 1');
      const isOldData = (checkOldCat && checkOldCat.name === 'Áo') ||
        (checkOldImg && (
          checkOldImg.img === 'hinh1.jpg' ||
          checkOldImg.img === 'product_shirt.png' ||
          checkOldImg.img === 'product_shoes.png' ||
          checkOldImg.img === 'product_bag.png' ||
          checkOldImg.img === 'product_hat.png'
        ));
      if (isOldData) {
        await database.execAsync(`
          DELETE FROM order_items;
          DELETE FROM orders;
          DELETE FROM cart;
          DELETE FROM products;
          DELETE FROM categories;
        `);
      }
    } catch (e) {
      console.log('Check old data error:', e);
    }

    // Chèn danh mục mặc định nếu chưa có
    const catCheck = await database.getFirstAsync<{ cnt: number }>('SELECT COUNT(*) AS cnt FROM categories');
    if ((catCheck?.cnt ?? 0) === 0) {
      for (const cat of initialCategories) {
        await database.runAsync(
          'INSERT INTO categories (id, name) VALUES (?, ?)',
          cat.id,
          cat.name
        );
      }
    }

    // Tạo tài khoản mẫu (admin + user) nếu chưa có
    for (const u of initialUsers) {
      await database.runAsync(
        `INSERT INTO users (username, password, role)
         SELECT ?, ?, ?
         WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = ?)`,
        u.username,
        u.password,
        u.role,
        u.username
      );
    }

    // Chèn sản phẩm mặc định nếu chưa có
    const countRow = await database.getFirstAsync<{ cnt: number }>(
      'SELECT COUNT(*) AS cnt FROM products'
    );
    if ((countRow?.cnt ?? 0) === 0) {
      for (const product of initialProducts) {
        await database.runAsync(
          'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)',
          product.name,
          product.price,
          product.img,
          product.categoryId
        );
      }
    }

    console.log('✅ Database initialized successfully');
    onSuccess?.();
  } catch (error) {
    console.error('❌ initDatabase error:', error);
  }
};

// ==========================================
// CATEGORIES CRUD
// ==========================================
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const database = await getDb();
    return await database.getAllAsync<Category>('SELECT * FROM categories ORDER BY id');
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
};

export const addCategory = async (name: string): Promise<boolean> => {
  try {
    const database = await getDb();
    await database.runAsync('INSERT INTO categories (name) VALUES (?)', name);
    return true;
  } catch (error) {
    console.error('❌ Error adding category:', error);
    return false;
  }
};

export const updateCategory = async (category: Category): Promise<boolean> => {
  try {
    const database = await getDb();
    await database.runAsync('UPDATE categories SET name = ? WHERE id = ?', category.name, category.id);
    return true;
  } catch (error) {
    console.error('❌ Error updating category:', error);
    return false;
  }
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  try {
    const database = await getDb();
    await database.runAsync('DELETE FROM categories WHERE id = ?', id);
    return true;
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    return false;
  }
};

// ==========================================
// PRODUCTS CRUD
// ==========================================
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const database = await getDb();
    return await database.getAllAsync<Product>('SELECT * FROM products ORDER BY id DESC');
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const database = await getDb();
    await database.runAsync(
      'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)',
      product.name,
      product.price,
      product.img,
      product.categoryId
    );
    console.log('✅ Product added');
  } catch (error) {
    console.error('❌ Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (product: Product) => {
  try {
    const database = await getDb();
    await database.runAsync(
      'UPDATE products SET name = ?, price = ?, categoryId = ?, img = ? WHERE id = ?',
      product.name,
      product.price,
      product.categoryId,
      product.img,
      product.id
    );
    console.log('✅ Product updated');
  } catch (error) {
    console.error('❌ Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const database = await getDb();
    await database.runAsync('DELETE FROM products WHERE id = ?', id);
    console.log('✅ Product deleted');
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    throw error;
  }
};

export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const database = await getDb();
    return await database.getAllAsync<Product>(
      'SELECT * FROM products WHERE categoryId = ? ORDER BY id DESC',
      categoryId
    );
  } catch (error) {
    console.error('❌ Error fetching products by category:', error);
    return [];
  }
};

export const searchProductsByNameOrCategory = async (keyword: string): Promise<Product[]> => {
  try {
    const database = await getDb();
    const pattern = `%${keyword}%`;
    return await database.getAllAsync<Product>(
      `SELECT p.* FROM products p
       LEFT JOIN categories c ON p.categoryId = c.id
       WHERE p.name LIKE ? OR c.name LIKE ?
       ORDER BY p.id DESC`,
      pattern,
      pattern
    );
  } catch (error) {
    console.error('❌ Error searching products:', error);
    return [];
  }
};

export const fetchProductsByPriceRange = async (min: number, max: number): Promise<Product[]> => {
  try {
    const database = await getDb();
    return await database.getAllAsync<Product>(
      'SELECT * FROM products WHERE price >= ? AND price <= ? ORDER BY price ASC',
      min,
      max
    );
  } catch (error) {
    console.error('❌ Error fetching products by price range:', error);
    return [];
  }
};

// ==========================================
// USERS CRUD
// ==========================================
export const addUser = async (
  username: string,
  password: string,
  role: string
): Promise<boolean> => {
  try {
    const database = await getDb();
    await database.runAsync(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      username,
      password,
      role
    );
    return true;
  } catch (error) {
    console.error('❌ Error adding user:', error);
    return false;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const database = await getDb();
    return await database.getAllAsync<User>('SELECT * FROM users ORDER BY id');
  } catch (error) {
    return [];
  }
};

export const getUserByCredentials = async (
  username: string,
  password: string
): Promise<User | null> => {
  try {
    const database = await getDb();
    const user = await database.getFirstAsync<User>(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      username,
      password
    );
    return user ?? null;
  } catch (error) {
    return null;
  }
};

export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const database = await getDb();
    await database.runAsync('DELETE FROM users WHERE id = ?', id);
    return true;
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    return false;
  }
};

export const updateUserRole = async (id: number, role: string): Promise<boolean> => {
  try {
    const database = await getDb();
    await database.runAsync('UPDATE users SET role = ? WHERE id = ?', role, id);
    return true;
  } catch (error) {
    console.error('❌ Error updating user role:', error);
    return false;
  }
};

export const updateUserProfile = async (id: number, username: string, password?: string): Promise<boolean> => {
  try {
    const database = await getDb();
    if (password && password.trim() !== '') {
      await database.runAsync('UPDATE users SET username = ?, password = ? WHERE id = ?', username, password, id);
    } else {
      await database.runAsync('UPDATE users SET username = ? WHERE id = ?', username, id);
    }
    return true;
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    return false;
  }
};

// ==========================================
// CART OPERATIONS
// ==========================================
export const addToCart = async (userId: number, productId: number, quantity: number): Promise<void> => {
  try {
    const database = await getDb();
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existing = await database.getFirstAsync<{ id: number; quantity: number }>(
      'SELECT id, quantity FROM cart WHERE userId = ? AND productId = ?',
      userId,
      productId
    );

    if (existing) {
      const newQty = existing.quantity + quantity;
      await database.runAsync('UPDATE cart SET quantity = ? WHERE id = ?', newQty, existing.id);
    } else {
      await database.runAsync(
        'INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)',
        userId,
        productId,
        quantity
      );
    }
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    throw error;
  }
};

export const fetchCart = async (userId: number): Promise<CartItem[]> => {
  try {
    const database = await getDb();
    return await database.getAllAsync<CartItem>(
      `SELECT c.id, c.userId, c.productId, c.quantity, p.name, p.price, p.img
       FROM cart c
       JOIN products p ON c.productId = p.id
       WHERE c.userId = ?`,
      userId
    );
  } catch (error) {
    console.error('❌ Error fetching cart:', error);
    return [];
  }
};

export const updateCartQuantity = async (cartId: number, quantity: number): Promise<void> => {
  try {
    const database = await getDb();
    if (quantity <= 0) {
      await database.runAsync('DELETE FROM cart WHERE id = ?', cartId);
    } else {
      await database.runAsync('UPDATE cart SET quantity = ? WHERE id = ?', quantity, cartId);
    }
  } catch (error) {
    console.error('❌ Error updating cart quantity:', error);
    throw error;
  }
};

export const removeFromCart = async (cartId: number): Promise<void> => {
  try {
    const database = await getDb();
    await database.runAsync('DELETE FROM cart WHERE id = ?', cartId);
  } catch (error) {
    console.error('❌ Error removing from cart:', error);
    throw error;
  }
};

export const clearCart = async (userId: number): Promise<void> => {
  try {
    const database = await getDb();
    await database.runAsync('DELETE FROM cart WHERE userId = ?', userId);
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
    throw error;
  }
};

// ==========================================
// ORDER OPERATIONS
// ==========================================
export const createOrder = async (
  userId: number,
  items: { productId: number; quantity: number; price: number }[],
  address: string,
  phone: string,
  totalPrice: number
): Promise<number> => {
  try {
    const database = await getDb();
    const orderDate = new Date().toISOString();
    const status = 'Đang xử lý';

    // Tạo đơn hàng mới
    const result = await database.runAsync(
      'INSERT INTO orders (userId, totalPrice, orderDate, status, address, phone) VALUES (?, ?, ?, ?, ?, ?)',
      userId,
      totalPrice,
      orderDate,
      status,
      address,
      phone
    );

    const orderId = result.lastInsertRowId;

    // Chèn chi tiết đơn hàng
    for (const item of items) {
      await database.runAsync(
        'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
        orderId,
        item.productId,
        item.quantity,
        item.price
      );
    }

    // Xóa giỏ hàng sau khi đặt hàng
    await clearCart(userId);

    return orderId;
  } catch (error) {
    console.error('❌ Error creating order:', error);
    throw error;
  }
};

export const fetchUserOrders = async (userId: number): Promise<any[]> => {
  try {
    const database = await getDb();
    const orders = await database.getAllAsync<Order>(
      'SELECT * FROM orders WHERE userId = ? ORDER BY id DESC',
      userId
    );

    const fullOrders = [];
    for (const order of orders) {
      const items = await database.getAllAsync<any>(
        `SELECT oi.id, oi.orderId, oi.productId, oi.quantity, oi.price, p.name as productName
         FROM order_items oi
         LEFT JOIN products p ON oi.productId = p.id
         WHERE oi.orderId = ?`,
        order.id
      );
      fullOrders.push({ ...order, items });
    }
    return fullOrders;
  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    return [];
  }
};

export const fetchAllOrders = async (): Promise<any[]> => {
  try {
    const database = await getDb();
    const orders = await database.getAllAsync<any>(
      `SELECT o.*, u.username
       FROM orders o
       JOIN users u ON o.userId = u.id
       ORDER BY o.id DESC`
    );

    const fullOrders = [];
    for (const order of orders) {
      const items = await database.getAllAsync<any>(
        `SELECT oi.id, oi.orderId, oi.productId, oi.quantity, oi.price, p.name as productName
         FROM order_items oi
         LEFT JOIN products p ON oi.productId = p.id
         WHERE oi.orderId = ?`,
        order.id
      );
      fullOrders.push({ ...order, items });
    }
    return fullOrders;
  } catch (error) {
    console.error('❌ Error fetching all orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: number, status: string): Promise<void> => {
  try {
    const database = await getDb();
    await database.runAsync('UPDATE orders SET status = ? WHERE id = ?', status, orderId);
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    throw error;
  }
};
