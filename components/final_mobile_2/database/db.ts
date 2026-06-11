import * as SQLite from 'expo-sqlite';

let _db: SQLite.SQLiteDatabase | null = null;

const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync('mydb_final_mobile_2_v3.db');
    // Enable WAL mode and busy timeout to prevent 'database is locked' errors
    try {
      await _db.execAsync('PRAGMA journal_mode = WAL;');
      await _db.execAsync('PRAGMA busy_timeout = 5000;');
    } catch (err) {
      console.warn('⚠️ Failed to configure PRAGMAs:', err);
    }
  }
  return _db;
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
  email?: string;
  phone?: string;
  fullname?: string;
  address?: string;
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

import { products as staticProducts } from '../data/products';

const resolveCategoryId = (brand: string): number => {
  if (brand === 'Lenses') return 2;
  if (brand === 'Flycam') return 5;
  if (brand === 'Phụ kiện' || brand === 'Skin' || brand === 'Micro' || brand === 'Gimbal' || brand === 'Action Camera') return 3;
  if (brand === 'OM System' || brand === 'Canon' || brand === 'Nikon' || brand === 'Sony' || brand === 'Fujifilm') return 1;
  return 3;
};

const initialProducts: Omit<Product, 'id'>[] = staticProducts.map(p => ({
  name: p.name,
  price: p.price,
  img: p.image,
  categoryId: resolveCategoryId(p.brand)
}));

const initialUsers: Omit<User, 'id'>[] = [
  { username: 'admin', password: '123456', role: 'admin' },
  { username: 'user1', password: '123456', role: 'user' },
  { username: 'user2', password: '123456', role: 'user' },
  { username: 'huy@gmail.com', password: '123456', role: 'user' },
];

export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  try {
    const database = await getDb();

    // Enable foreign keys separately first
    await database.execAsync('PRAGMA foreign_keys = ON;');

    await database.execAsync(`
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
        role TEXT,
        email TEXT,
        phone TEXT,
        fullname TEXT,
        address TEXT
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
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    // Tự động kiểm tra và thêm các cột bị thiếu vào bảng users (migration)
    try {
      const tableInfo = await database.getAllAsync<{ name: string }>('PRAGMA table_info(users)');
      const columns = tableInfo.map(col => col.name);
      if (!columns.includes('email')) {
        await database.execAsync('ALTER TABLE users ADD COLUMN email TEXT;');
        console.log('Migrated: Added email column to users table');
      }
      if (!columns.includes('phone')) {
        await database.execAsync('ALTER TABLE users ADD COLUMN phone TEXT;');
        console.log('Migrated: Added phone column to users table');
      }
      if (!columns.includes('fullname')) {
        await database.execAsync('ALTER TABLE users ADD COLUMN fullname TEXT;');
        console.log('Migrated: Added fullname column to users table');
      }
      if (!columns.includes('address')) {
        await database.execAsync('ALTER TABLE users ADD COLUMN address TEXT;');
        console.log('Migrated: Added address column to users table');
      }
    } catch (migError) {
      console.warn('⚠️ User table migration warning:', migError);
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

    // Chèn sản phẩm mặc định nếu chưa có hoặc ít hơn 20 sản phẩm
    const countRow = await database.getFirstAsync<{ cnt: number }>(
      'SELECT COUNT(*) AS cnt FROM products'
    );
    if ((countRow?.cnt ?? 0) < 20) {
      await database.runAsync('DELETE FROM products');
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
    console.error('❌ initDatabase error, attempting recovery:', error);
    try {
      const database = await getDb();
      console.log('⚠️ Dropping all tables to recover from corruption/mismatch...');
      await database.execAsync(`
        DROP TABLE IF EXISTS order_items;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS categories;
        DROP TABLE IF EXISTS settings;
      `);

      console.log('⚠️ Re-creating and re-seeding tables...');
      await database.execAsync(`
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
          role TEXT,
          email TEXT,
          phone TEXT,
          fullname TEXT
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
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT
        );
      `);

      for (const cat of initialCategories) {
        await database.runAsync('INSERT INTO categories (id, name) VALUES (?, ?)', cat.id, cat.name);
      }

      for (const u of initialUsers) {
        await database.runAsync('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', u.username, u.password, u.role);
      }

      for (const product of initialProducts) {
        await database.runAsync(
          'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)',
          product.name,
          product.price,
          product.img,
          product.categoryId
        );
      }

      console.log('✅ Database recovered and initialized successfully');
      onSuccess?.();
    } catch (recoveryError) {
      console.error('❌ Database recovery failed completely:', recoveryError);
    }
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
  } catch (error) {
    console.error('❌ Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const database = await getDb();
    await database.runAsync('DELETE FROM products WHERE id = ?', id);
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
  role: string,
  email?: string,
  phone?: string,
  fullname?: string
): Promise<boolean> => {
  try {
    const database = await getDb();
    await database.runAsync(
      'INSERT INTO users (username, password, role, email, phone, fullname) VALUES (?, ?, ?, ?, ?, ?)',
      username,
      password,
      role,
      email ?? null,
      phone ?? null,
      fullname ?? null
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
      'SELECT * FROM users WHERE LOWER(username) = LOWER(?) AND password = ?',
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

export const updateUserDetail = async (
  id: number,
  username: string,
  fullname: string,
  email: string,
  phone: string,
  role: string,
  address: string,
  password?: string
): Promise<boolean> => {
  try {
    const database = await getDb();
    if (password && password.trim() !== '') {
      await database.runAsync(
        'UPDATE users SET username = ?, fullname = ?, email = ?, phone = ?, role = ?, address = ?, password = ? WHERE id = ?',
        username,
        fullname,
        email,
        phone,
        role,
        address,
        password,
        id
      );
    } else {
      await database.runAsync(
        'UPDATE users SET username = ?, fullname = ?, email = ?, phone = ?, role = ?, address = ? WHERE id = ?',
        username,
        fullname,
        email,
        phone,
        role,
        address,
        id
      );
    }
    return true;
  } catch (error) {
    console.error('❌ Error updating user detail:', error);
    return false;
  }
};

export const updateUserProfile = async (
  id: number,
  username: string,
  fullname: string,
  email: string,
  phone: string,
  address: string,
  password?: string
): Promise<boolean> => {
  try {
    const database = await getDb();
    if (password && password.trim() !== '') {
      await database.runAsync(
        'UPDATE users SET username = ?, fullname = ?, email = ?, phone = ?, address = ?, password = ? WHERE id = ?',
        username,
        fullname,
        email,
        phone,
        address,
        password,
        id
      );
    } else {
      await database.runAsync(
        'UPDATE users SET username = ?, fullname = ?, email = ?, phone = ?, address = ? WHERE id = ?',
        username,
        fullname,
        email,
        phone,
        address,
        id
      );
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

    for (const item of items) {
      await database.runAsync(
        'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
        orderId,
        item.productId,
        item.quantity,
        item.price
      );
    }

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

// ==========================================
// PERSISTENT PREFERENCES / SETTINGS
// ==========================================
export const getSetting = async (key: string): Promise<string | null> => {
  try {
    const database = await getDb();
    const row = await database.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', key);
    return row?.value ?? null;
  } catch (error) {
    return null;
  }
};

export const setSetting = async (key: string, value: string): Promise<void> => {
  try {
    const database = await getDb();
    await database.runAsync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', key, value);
  } catch (error) {
    console.error('❌ Error saving preference:', error);
  }
};
