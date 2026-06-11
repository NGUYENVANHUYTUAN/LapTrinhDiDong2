/**
 * database.web.ts
 * Phiên bản web dùng localStorage để persist data (thay in-memory).
 * Tương thích hoàn toàn với database.ts (SQLite) về API.
 */

export type Category = { id: number; name: string };
export type Product = { id: number; name: string; price: number; img: string; categoryId: number };
export type User = { id: number; username: string; password: string; role: string };
export type CartItem = { id: number; userId: number; productId: number; quantity: number; name?: string; price?: number; img?: string };
export type Order = { id: number; userId: number; totalPrice: number; orderDate: string; status: string; address: string; phone: string; username?: string };
export type OrderItem = { id: number; orderId: number; productId: number; quantity: number; price: number; productName?: string };

// ─── LocalStorage helpers ────────────────────────────────────────────────────
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── Khởi tạo dữ liệu mặc định nếu chưa có ──────────────────────────────────
const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Áo' }, { id: 2, name: 'Giày' },
  { id: 3, name: 'Balo' }, { id: 4, name: 'Mũ' }, { id: 5, name: 'Túi' },
];
const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: 'Áo sơ mi trắng', price: 250000, img: 'product_shirt.png', categoryId: 1 },
  { id: 2, name: 'Áo thun basic', price: 180000, img: 'product_shirt.png', categoryId: 1 },
  { id: 3, name: 'Giày sneaker trắng', price: 1100000, img: 'product_shoes.png', categoryId: 2 },
  { id: 4, name: 'Giày thể thao', price: 850000, img: 'product_shoes.png', categoryId: 2 },
  { id: 5, name: 'Balo thời trang', price: 490000, img: 'product_bag.png', categoryId: 3 },
  { id: 6, name: 'Balo du lịch', price: 650000, img: 'product_bag.png', categoryId: 3 },
  { id: 7, name: 'Mũ lưỡi trai', price: 120000, img: 'product_hat.png', categoryId: 4 },
  { id: 8, name: 'Mũ bucket', price: 150000, img: 'product_hat.png', categoryId: 4 },
  { id: 9, name: 'Túi xách da', price: 980000, img: 'product_handbag.png', categoryId: 5 },
  { id: 10, name: 'Túi tote vải', price: 320000, img: 'product_handbag.png', categoryId: 5 },
];
const DEFAULT_USERS: User[] = [
  { id: 1, username: 'admin', password: '123456', role: 'admin' },
  { id: 2, username: 'user1', password: '123456', role: 'user' },
  { id: 3, username: 'user2', password: '123456', role: 'user' },
];

// ─── Getters/Setters (luôn đọc từ localStorage) ───────────────────────────────
const getCategories  = () => load<Category[]>('db_categories',  DEFAULT_CATEGORIES);
const getProducts    = () => load<Product[]>('db_products',     DEFAULT_PRODUCTS);
const getUsers       = () => load<User[]>('db_users',           DEFAULT_USERS);
const getCart        = () => load<{ id: number; userId: number; productId: number; quantity: number }[]>('db_cart', []);
const getOrders      = () => load<Order[]>('db_orders',         []);
const getOrderItems  = () => load<OrderItem[]>('db_order_items',[]);

const setCategories  = (v: Category[])  => save('db_categories',  v);
const setProducts    = (v: Product[])   => save('db_products',     v);
const setUsers       = (v: User[])      => save('db_users',        v);
const setCart        = (v: any[])       => save('db_cart',         v);
const setOrders      = (v: Order[])     => save('db_orders',       v);
const setOrderItems  = (v: OrderItem[]) => save('db_order_items',  v);

const nextId = (items: { id: number }[]) => items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;

// ─── Init ─────────────────────────────────────────────────────────────────────
export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  // Seed nếu chưa có
  if (!localStorage.getItem('db_categories')) setCategories(DEFAULT_CATEGORIES);
  if (!localStorage.getItem('db_products'))   setProducts(DEFAULT_PRODUCTS);
  if (!localStorage.getItem('db_users'))      setUsers(DEFAULT_USERS);
  console.log('✅ [Web/localStorage] Database ready');
  onSuccess?.();
};

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
export const fetchCategories = async (): Promise<Category[]> =>
  [...getCategories()].sort((a, b) => a.id - b.id);

export const addCategory = async (name: string): Promise<boolean> => {
  const cats = getCategories();
  cats.push({ id: nextId(cats), name });
  setCategories(cats);
  return true;
};

export const updateCategory = async (category: Category): Promise<boolean> => {
  const cats = getCategories().map(c => c.id === category.id ? category : c);
  setCategories(cats);
  return true;
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  setCategories(getCategories().filter(c => c.id !== id));
  setProducts(getProducts().filter(p => p.categoryId !== id));
  return true;
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export const fetchProducts = async (): Promise<Product[]> =>
  [...getProducts()].sort((a, b) => b.id - a.id);

export const addProduct = async (product: Omit<Product, 'id'>) => {
  const prods = getProducts();
  prods.push({ id: nextId(prods), ...product });
  setProducts(prods);
};

export const updateProduct = async (product: Product) => {
  setProducts(getProducts().map(p => p.id === product.id ? product : p));
};

export const deleteProduct = async (id: number) => {
  setProducts(getProducts().filter(p => p.id !== id));
};

export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> =>
  getProducts().filter(p => p.categoryId === categoryId).sort((a, b) => b.id - a.id);

export const searchProductsByNameOrCategory = async (keyword: string): Promise<Product[]> => {
  const k = keyword.toLowerCase();
  const cats = getCategories();
  return getProducts().filter(p => {
    const cat = cats.find(c => c.id === p.categoryId);
    return p.name.toLowerCase().includes(k) || (cat?.name.toLowerCase().includes(k) ?? false);
  }).sort((a, b) => b.id - a.id);
};

export const fetchProductsByPriceRange = async (min: number, max: number): Promise<Product[]> =>
  getProducts().filter(p => p.price >= min && p.price <= max).sort((a, b) => a.price - b.price);

// ─── USERS ────────────────────────────────────────────────────────────────────
export const addUser = async (username: string, password: string, role: string): Promise<boolean> => {
  const users = getUsers();
  if (users.some(u => u.username === username)) return false;
  users.push({ id: nextId(users), username, password, role });
  setUsers(users);
  return true;
};

export const fetchUsers = async (): Promise<User[]> =>
  [...getUsers()].sort((a, b) => a.id - b.id);

export const getUserByCredentials = async (username: string, password: string): Promise<User | null> =>
  getUsers().find(u => u.username === username && u.password === password) ?? null;

export const deleteUser = async (id: number): Promise<boolean> => {
  setUsers(getUsers().filter(u => u.id !== id));
  setCart(getCart().filter(c => c.userId !== id));
  setOrders(getOrders().filter(o => o.userId !== id));
  return true;
};

export const updateUserRole = async (id: number, role: string): Promise<boolean> => {
  setUsers(getUsers().map(u => u.id === id ? { ...u, role } : u));
  return true;
};

export const updateUserProfile = async (id: number, username: string, password?: string): Promise<boolean> => {
  setUsers(getUsers().map(u => {
    if (u.id !== id) return u;
    return { ...u, username, ...(password && password.trim() ? { password } : {}) };
  }));
  return true;
};

// ─── CART ─────────────────────────────────────────────────────────────────────
export const addToCart = async (userId: number, productId: number, quantity: number): Promise<void> => {
  const cart = getCart();
  const existing = cart.find(c => c.userId === userId && c.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: nextId(cart), userId, productId, quantity });
  }
  setCart(cart);
};

export const fetchCart = async (userId: number): Promise<CartItem[]> => {
  const prods = getProducts();
  return getCart()
    .filter(c => c.userId === userId)
    .map(c => {
      const p = prods.find(prod => prod.id === c.productId);
      return {
        id: c.id, userId: c.userId, productId: c.productId, quantity: c.quantity,
        name: p?.name ?? 'Sản phẩm đã xóa',
        price: p?.price ?? 0,
        img: p?.img ?? 'hinh1.jpg',
      };
    });
};

export const updateCartQuantity = async (cartId: number, quantity: number): Promise<void> => {
  if (quantity <= 0) {
    setCart(getCart().filter(c => c.id !== cartId));
  } else {
    setCart(getCart().map(c => c.id === cartId ? { ...c, quantity } : c));
  }
};

export const removeFromCart = async (cartId: number): Promise<void> => {
  setCart(getCart().filter(c => c.id !== cartId));
};

export const clearCart = async (userId: number): Promise<void> => {
  setCart(getCart().filter(c => c.userId !== userId));
};

// ─── ORDERS ───────────────────────────────────────────────────────────────────
export const createOrder = async (
  userId: number,
  items: { productId: number; quantity: number; price: number }[],
  address: string,
  phone: string,
  totalPrice: number
): Promise<number> => {
  const orders = getOrders();
  const orderItems = getOrderItems();

  const orderId = nextId(orders);
  const orderDate = new Date().toISOString();

  orders.push({ id: orderId, userId, totalPrice, orderDate, status: 'Đang xử lý', address, phone });
  setOrders(orders);

  const newItems: OrderItem[] = items.map((item, i) => ({
    id: nextId(orderItems) + i,
    orderId,
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
  }));
  setOrderItems([...orderItems, ...newItems]);

  await clearCart(userId);
  return orderId;
};

export const fetchUserOrders = async (userId: number): Promise<any[]> => {
  const prods = getProducts();
  const allItems = getOrderItems();

  return getOrders()
    .filter(o => o.userId === userId)
    .sort((a, b) => b.id - a.id)
    .map(o => {
      const items = allItems
        .filter(oi => oi.orderId === o.id)
        .map(oi => ({
          ...oi,
          productName: prods.find(p => p.id === oi.productId)?.name ?? 'Sản phẩm đã xóa',
        }));
      return { ...o, items };
    });
};

export const fetchAllOrders = async (): Promise<any[]> => {
  const users = getUsers();
  const prods = getProducts();
  const allItems = getOrderItems();

  return getOrders()
    .sort((a, b) => b.id - a.id)
    .map(o => {
      const u = users.find(user => user.id === o.userId);
      const items = allItems
        .filter(oi => oi.orderId === o.id)
        .map(oi => ({
          ...oi,
          productName: prods.find(p => p.id === oi.productId)?.name ?? 'Sản phẩm đã xóa',
        }));
      return { ...o, username: u?.username ?? 'Người dùng đã xóa', items };
    });
};

export const updateOrderStatus = async (orderId: number, status: string): Promise<void> => {
  setOrders(getOrders().map(o => o.id === orderId ? { ...o, status } : o));
};
