import { useState } from "react";
import "./App.css";
 
/* ── helpers ─────────────────────────────────────────────── */
const PLACEHOLDER =
  "https://via.placeholder.com/640x480/e8ecf0/5a6775?text=Image+Unavailable";
 
const handleImgErr = (e) => {
  if (e.target.src !== PLACEHOLDER) e.target.src = PLACEHOLDER;
};
 
const safeImage = (url) => {
  if (!url) return PLACEHOLDER;
  if (url.startsWith("https://share.google/")) {
    const id = url.split("/").pop();
    return id ? `https://drive.google.com/uc?export=view&id=${id}` : PLACEHOLDER;
  }
  if (url.includes("drive.google.com")) {
    const m = url.match(/(?:id=|file\/d\/)([-\w]{10,})/);
    return m ? `https://drive.google.com/uc?export=view&id=${m[1]}` : PLACEHOLDER;
  }
  return url;
};
 
const parsePrice = (p) => Number(p.replace(/[^0-9.]+/g, ""));
const fmtINR = (n) =>
  n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
 
/* fake star ratings */
const RATINGS = [4.1,4.3,4.5,4.6,3.9,4.4,4.2,4.7,4.0,4.3,4.1,4.5,4.2,4.6,3.8,4.4];
const getRating = (i) => RATINGS[i % RATINGS.length];
const getReviews = (i) => [120,843,2310,567,1042,389,2891,76,412,1587,234,930,65,2041,178,455][i % 16];
const getDiscount = (i) => [10,15,20,8,12,18,25,5][i % 8];
const renderStars = (r) => "★".repeat(Math.floor(r)) + (r % 1 >= 0.5 ? "½" : "");
 
/* ── products ────────────────────────────────────────────── */
const PRODUCTS = [
  { name:"Lenovo Laptop", category:"Laptops", price:"₹54,999", image:"https://images.pexels.com/photos/1028441/pexels-photo-1028441.jpeg", description:"Reliable Lenovo laptop for work, study, and everyday use." },
  { name:"ThinkPad", category:"Laptops", price:"₹69,999", image:"https://images.pexels.com/photos/3550482/pexels-photo-3550482.jpeg", description:"Durable business laptop with an excellent keyboard and strong performance." },
  { name:"Huawei MateBook", category:"Laptops", price:"₹72,999", image:"https://images.pexels.com/photos/28920240/pexels-photo-28920240.jpeg", description:"Premium laptop with a sleek design and sharp display." },
  { name:"HP Laptop", category:"Laptops", price:"₹48,999", image:"https://images.pexels.com/photos/1212842/pexels-photo-1212842.jpeg", description:"A powerful HP laptop for everyday productivity and entertainment." },
  { name:"ASUS Laptop", category:"Laptops", price:"₹59,999", image:"https://images.pexels.com/photos/14328581/pexels-photo-14328581.jpeg", description:"High-performance ASUS laptop with modern cooling and vivid visuals." },
  { name:"Apple 17 Pro", category:"Laptops", price:"₹2,49,999", image:"https://images.pexels.com/photos/34624326/pexels-photo-34624326.jpeg", description:"Premium 17-inch laptop built for creators and professional workflows." },
  { name:"OnePlus Phone", category:"Mobiles", price:"₹34,999", image:"https://images.pexels.com/photos/8171129/pexels-photo-8171129.jpeg", description:"Fast Android phone with smooth performance and a clean user experience." },
  { name:"Nothing Phone", category:"Mobiles", price:"₹29,999", image:"https://images.pexels.com/photos/14398223/pexels-photo-14398223.jpeg", description:"Minimalist smartphone with a transparent finish and intuitive display." },
  { name:"Realme Phone", category:"Mobiles", price:"₹19,999", image:"https://images.pexels.com/photos/33376221/pexels-photo-33376221.jpeg", description:"Affordable smartphone with a large screen and long battery life." },
  { name:"Redmi Phone", category:"Mobiles", price:"₹18,999", image:"https://images.pexels.com/photos/28190520/pexels-photo-28190520.jpeg", description:"Value-packed phone with a bright display and multi-camera setup." },
  { name:"Oppo Phone", category:"Mobiles", price:"₹24,999", image:"https://images.pexels.com/photos/20074768/pexels-photo-20074768.jpeg", description:"Stylish smartphone with fast charging and sharp camera features." },
  { name:"Vivo Phone", category:"Mobiles", price:"₹22,999", image:"https://images.pexels.com/photos/35229446/pexels-photo-35229446.jpeg", description:"Sleek mobile phone with an immersive display and smart camera." },
  { name:"Google Phone", category:"Mobiles", price:"₹69,999", image:"https://images.pexels.com/photos/32218867/pexels-photo-32218867.jpeg", description:"Stock Android phone with excellent camera performance and software support." },
  { name:"Kitchen Mixer", category:"Kitchen", price:"₹4,499", image:"https://plus.unsplash.com/premium_photo-1718043036199-d98bef36af46?w=1000&auto=format&fit=crop&q=60", description:"Compact mixer for preparing dough, batters, and kitchen prep tasks." },
  { name:"Juice Blender", category:"Kitchen", price:"₹3,299", image:"https://images.pexels.com/photos/28100422/pexels-photo-28100422.jpeg", description:"Blender for fresh juices, smoothies, and easy meal prep." },
  { name:"Air Fryer", category:"Kitchen", price:"₹7,499", image:"https://plus.unsplash.com/premium_photo-1672192166833-c8ae84e5e127?w=1000&auto=format&fit=crop&q=60", description:"Healthy air fryer for crispy snacks with minimal oil." },
  { name:"OTG Oven", category:"Kitchen", price:"₹6,999", image:"https://plus.unsplash.com/premium_photo-1673439305380-79947d273735?w=1000&auto=format&fit=crop&q=60", description:"Versatile OTG oven for baking, grilling, and toasting." },
  { name:"Electric Cooker", category:"Kitchen", price:"₹2,899", image:"https://plus.unsplash.com/premium_photo-1711051351678-658b273f71d4?w=1000&auto=format&fit=crop&q=60", description:"Fast electric cooker for soups, rice, and daily meals." },
  { name:"Electric Kettle", category:"Kitchen", price:"₹1,499", image:"https://media.istockphoto.com/id/1571815108/photo/close-up-shot-of-an-unrecognisable-woman-using-kettle-in-kitchen.webp?a=1&b=1&s=612x612&w=0&k=20&c=CrOTb-PlmxCj2CYoPF4h6C4edn0OR4vRsosN46MNdlU=", description:"Quick-boil kettle with auto shutoff and safe grip." },
  { name:"Induction Stove", category:"Kitchen", price:"₹2,199", image:"https://plus.unsplash.com/premium_photo-1718735910395-94a28fbc9f6b?w=1000&auto=format&fit=crop&q=60", description:"Portable induction stove for efficient cooking." },
  { name:"Frying Pan", category:"Kitchen", price:"₹1,199", image:"https://images.pexels.com/photos/6823599/pexels-photo-6823599.jpeg", description:"Non-stick frying pan for everyday cooking." },
  { name:"Dining Table", category:"Furniture", price:"₹12,999", image:"https://images.pexels.com/photos/35057475/pexels-photo-35057475.jpeg", description:"Modern dining table for family meals and gatherings." },
  { name:"Sofa", category:"Furniture", price:"₹24,999", image:"https://images.pexels.com/photos/6758245/pexels-photo-6758245.jpeg", description:"Comfortable sofa with soft cushions and durable fabric." },
  { name:"Bed with Frame", category:"Furniture", price:"₹18,999", image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&auto=format&fit=crop&q=60", description:"Sturdy bed frame with a modern finish for any bedroom." },
  { name:"Mirror", category:"Furniture", price:"₹3,499", image:"https://images.pexels.com/photos/20596471/pexels-photo-20596471.jpeg", description:"Elegant wall mirror with a sleek frame for home decor." },
  { name:"Dinner Plates Set", category:"Home", price:"₹2,299", image:"https://images.pexels.com/photos/20130513/pexels-photo-20130513.jpeg", description:"Ceramic plate set ideal for family meals and entertaining." },
  { name:"Cutlery Set", category:"Home", price:"₹1,999", image:"https://images.pexels.com/photos/30993174/pexels-photo-30993174.jpeg", description:"Stainless steel cutlery set for daily use." },
  { name:"Cup and Saucer", category:"Home", price:"₹899", image:"https://images.pexels.com/photos/34744973/pexels-photo-34744973.jpeg", description:"Elegant cup and saucer set for coffee and tea." },
  { name:"Glass Set", category:"Home", price:"₹699", image:"https://images.pexels.com/photos/5987188/pexels-photo-5987188.jpeg", description:"Durable glass set for everyday drinks." },
  { name:"Embellished Anarkali", category:"Clothing", price:"₹8,499", image:"https://images.pexels.com/photos/35228792/pexels-photo-35228792.jpeg", description:"Traditional Anarkali dress with rich embroidery and styling." },
  { name:"Evergreen Long Dress", category:"Clothing", price:"₹4,299", image:"https://images.pexels.com/photos/12465066/pexels-photo-12465066.jpeg", description:"Flowing long dress in timeless hues for everyday elegance." },
  { name:"Vibrant Short Dress", category:"Clothing", price:"₹3,999", image:"https://images.pexels.com/photos/8512678/pexels-photo-8512678.jpeg", description:"Colorful short dress perfect for parties and outings." },
  { name:"Indian Wedding Dress", category:"Clothing", price:"₹18,999", image:"https://images.pexels.com/photos/12959396/pexels-photo-12959396.jpeg", description:"Traditional Indian wedding attire with premium detailing." },
  { name:"Ball Gown Princess Dress", category:"Clothing", price:"₹12,999", image:"https://images.pexels.com/photos/34172924/pexels-photo-34172924.jpeg", description:"Elegant ball gown style dress for special celebrations." },
  { name:"Gold Silver Dress", category:"Clothing", price:"₹9,499", image:"https://images.unsplash.com/photo-1589083133356-aa13ceaef7fd?w=1000&auto=format&fit=crop&q=60", description:"Shimmery gold and silver dress for evening parties." },
  { name:"Party Wear Outfit", category:"Clothing", price:"₹5,499", image:"https://images.pexels.com/photos/13285951/pexels-photo-13285951.jpeg", description:"Stylish party wear outfit for evening events." },
  { name:"Crop Top", category:"Clothing", price:"₹899", image:"https://images.pexels.com/photos/18679284/pexels-photo-18679284.jpeg", description:"Trendy crop top for casual, summer styling." },
  { name:"Casual Shirt", category:"Clothing", price:"₹1,299", image:"https://images.pexels.com/photos/16594456/pexels-photo-16594456.jpeg", description:"Smart casual shirt suitable for office and weekend wear." },
  { name:"Cotton T-Shirt", category:"Clothing", price:"₹799", image:"https://images.pexels.com/photos/4066292/pexels-photo-4066292.jpeg", description:"Comfortable cotton t-shirt for everyday use." },
  { name:"Jeans Classic", category:"Clothing", price:"₹1,499", image:"https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg", description:"Classic jeans with a regular fit for easy styling." },
];
 
const CATEGORIES = ["All","Laptops","Mobiles","Kitchen","Furniture","Home","Clothing"];
const CAT_ICONS = { All:"🏠", Laptops:"💻", Mobiles:"📱", Kitchen:"🍳", Furniture:"🛋️", Home:"🏡", Clothing:"👗" };
 
/* ── component ───────────────────────────────────────────── */
export default function App() {
  const [category, setCategory]       = useState("All");
  const [search, setSearch]           = useState("");
  const [viewProd, setViewProd]       = useState(null);
  const [buyProd, setBuyProd]         = useState(null);
  const [cart, setCart]               = useState([]);
  const [wishlist, setWishlist]       = useState([]);
  const [showCart, setShowCart]       = useState(false);
  const [showWish, setShowWish]       = useState(false);
  const [showLogin, setShowLogin]     = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [userName, setUserName]       = useState("");
  const [loginEmail, setLoginEmail]   = useState("");
  const [loginPass, setLoginPass]     = useState("");
  const [buyerName, setBuyerName]     = useState("");
  const [buyerEmail, setBuyerEmail]   = useState("");
  const [buyerPhone, setBuyerPhone]   = useState("");
  const [buyerAddr, setBuyerAddr]     = useState("");
  const [qty, setQty]                 = useState(1);
  const [orderOk, setOrderOk]         = useState(null);
  const [orders, setOrders]           = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
 
  const filtered = PRODUCTS.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchQ   = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  /* ── ORDER TRACKING HELPERS ── */
  const generateOrderId = () => "ORD" + Date.now().toString().slice(-8);
  const getTrackingStatus = (age) => {
    if (age < 1) return { text: "Processing", color: "#f59e0b", icon: "⏳" };
    if (age < 2) return { text: "Shipped", color: "#3b82f6", icon: "📦" };
    if (age < 3) return { text: "In Transit", color: "#06b6d4", icon: "🚚" };
    return { text: "Delivered", color: "#10b981", icon: "✅" };
  };
  const getEstimatedDelivery = (daysToAdd) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    return d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
  };
 
  const cartTotal = cart.reduce((s, i) => s + parsePrice(i.price), 0);
 
  const addCart    = (p) => setCart((c) => [...c, p]);
  const removeCart = (i) => setCart((c) => c.filter((_, idx) => idx !== i));
  const toggleWish = (p) => setWishlist((w) =>
    w.some((x) => x.name === p.name) ? w.filter((x) => x.name !== p.name) : [...w, p]
  );
  const inWish = (p) => wishlist.some((x) => x.name === p.name);
 
  const openBuy = (p) => {
    setOrderOk(null); setBuyerName(""); setBuyerEmail("");
    setBuyerPhone(""); setBuyerAddr(""); setQty(1); setBuyProd(p);
  };
 
  const submitOrder = (e) => {
    e.preventDefault();
    const orderId = generateOrderId();
    const newOrder = {
      orderId,
      product: buyProd.name,
      buyer: buyerName,
      email: buyerEmail,
      phone: buyerPhone,
      address: buyerAddr,
      quantity: qty,
      price: buyProd.price,
      orderDate: new Date(),
      estimatedDelivery: getEstimatedDelivery(3 + Math.floor(Math.random() * 2)),
    };
    setOrders((prev) => [...prev, newOrder]);
    setOrderOk(`Thank you, ${buyerName}! Your order for ${qty} × ${buyProd.name} is confirmed. We'll send details to ${buyerEmail}.`);
  };
 
  const submitLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setUserName(loginEmail.split("@")[0]);
    setShowLogin(false);
    setLoginEmail(""); setLoginPass("");
  };
 
  return (
    <div className="app">
      {/* ── TOP NAV ── */}
      <nav className="top-bar">
        <div className="brand-logo">Shoply<span>.</span></div>
 
        <div className="nav-search">
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="nav-search-btn" aria-label="Search">🔍</button>
        </div>
 
        <div className="nav-actions">
          {isLoggedIn ? (
            <>
              <span className="user-greeting">Hello, {userName}</span>
              <button className="nav-btn" onClick={() => { setIsLoggedIn(false); setUserName(""); }}>
                <span className="nav-btn-label">Account</span>
                <span className="nav-btn-value">Sign out</span>
              </button>
            </>
          ) : (
            <button className="nav-btn" onClick={() => setShowLogin(true)}>
              <span className="nav-btn-label">Hello, sign in</span>
              <span className="nav-btn-value">Account ▾</span>
            </button>
          )}
          <button className="nav-btn" onClick={() => setShowTracking(true)}>
            <span className="nav-btn-label">📦 Track Order</span>
            <span className="nav-btn-value">{orders.length} orders</span>
          </button>
          <button className="nav-btn" onClick={() => setShowWish(true)}>
            <span className="nav-btn-label">❤️ Wishlist</span>
            <span className="nav-btn-value">{wishlist.length} items</span>
          </button>
          <button className="nav-btn-cart" onClick={() => setShowCart(true)}>
            🛒 Cart <span className="cart-count">{cart.length}</span>
          </button>
        </div>
      </nav>
 
      {/* ── CATEGORY STRIP ── */}
      <div className="cat-strip">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`cat-btn${category === c ? " active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {CAT_ICONS[c]} {c}
          </button>
        ))}
      </div>
 
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <span className="hero-eyebrow">New arrivals 2026</span>
          <h1>Shop <em>premium</em> products<br />at unbeatable prices</h1>
          <p>Electronics, fashion, home essentials and more — delivered fast across India.</p>
          <div className="hero-pills">
            <span className="hero-pill"><span className="hero-pill-icon">🚀</span> Same-day dispatch</span>
            <span className="hero-pill"><span className="hero-pill-icon">🔒</span> Secure checkout</span>
            <span className="hero-pill"><span className="hero-pill-icon">↩️</span> 30-day returns</span>
            <span className="hero-pill"><span className="hero-pill-icon">⭐</span> Top-rated sellers</span>
          </div>
        </div>
      </section>
 
      {/* ── DEALS STRIP ── */}
      <div className="deals-strip">
        <span className="deals-label">🔥 Today's Deals</span>
        {["Up to 25% off Electronics","Min. 15% off Kitchen","Fashion from ₹799","Free delivery above ₹499"].map((d) => (
          <span key={d} className="deal-tag">{d}</span>
        ))}
      </div>
 
      {/* ── PRODUCTS ── */}
      <main className="page-content">
        <div className="section-header">
          <h2>{category === "All" ? "All Products" : category}</h2>
          <span className="section-count">{filtered.length} results</span>
        </div>
 
        <div className="products">
          {filtered.map((prod, idx) => {
            const disc = getDiscount(idx);
            const origPrice = Math.round(parsePrice(prod.price) * (1 + disc / 100));
            const rating    = getRating(idx);
            const reviews   = getReviews(idx);
            return (
              <div className="card" key={prod.name}>
                <div className="card-img-wrap">
                  <img src={safeImage(prod.image)} alt={prod.name} loading="lazy" onError={handleImgErr} />
                  <button
                    className="card-wishlist-btn"
                    onClick={() => toggleWish(prod)}
                    aria-label={inWish(prod) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {inWish(prod) ? "❤️" : "🤍"}
                  </button>
                  <span className="card-badge">{disc}% off</span>
                </div>
 
                <div className="card-body">
                  <div className="card-cat">{prod.category}</div>
                  <h3>{prod.name}</h3>
                  <div className="card-stars">
                    <span className="stars">{renderStars(rating)}</span>
                    <span className="review-count">({reviews.toLocaleString()})</span>
                  </div>
                </div>
 
                <div className="card-footer">
                  <div className="price-row">
                    <span className="price">{prod.price}</span>
                    <span className="price-orig">₹{origPrice.toLocaleString("en-IN")}</span>
                    <span className="price-off">Save {disc}%</span>
                  </div>
                  <div className="card-actions">
                    <button className="btn-buy" onClick={() => openBuy(prod)}>Buy Now</button>
                    <button className="btn-cart" onClick={() => addCart(prod)}>Add to Cart</button>
                    <button className="btn-view" onClick={() => setViewProd(prod)}>View Details</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
 
      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-logo">Shoply<span>.</span></div>
        <div className="footer-links">
          {["About Us","Help","Careers","Privacy Policy","Terms of Use"].map((l) => (
            <a key={l} href="#!">{l}</a>
          ))}
        </div>
        <p className="footer-copy">© 2026 Shoply. All rights reserved.</p>
      </footer>
 
      {/* ── VIEW MODAL ── */}
      {viewProd && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setViewProd(null)} role="button" tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setViewProd(null)} aria-label="Close" />
          <div className="modal-box">
            <img className="modal-img" src={safeImage(viewProd.image)} alt={viewProd.name} onError={handleImgErr} />
            <div className="modal-body">
              <div className="modal-header">
                <h2 className="modal-title">{viewProd.name}</h2>
                <button className="modal-close" onClick={() => setViewProd(null)}>✕</button>
              </div>
              <div className="modal-price">{viewProd.price}</div>
              <p className="modal-desc">{viewProd.description}</p>
              <div className="modal-actions">
                <button className="btn-modal-primary" onClick={() => { setViewProd(null); openBuy(viewProd); }}>Buy Now</button>
                <button className="btn-modal-secondary" onClick={() => { addCart(viewProd); setViewProd(null); }}>Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* ── BUY MODAL ── */}
      {buyProd && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setBuyProd(null)} role="button" tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setBuyProd(null)} aria-label="Close" />
          <div className="modal-box">
            <img className="modal-img" src={safeImage(buyProd.image)} alt={buyProd.name} onError={handleImgErr} />
            <div className="modal-body">
              <div className="modal-header">
                <h2 className="modal-title">{buyProd.name}</h2>
                <button className="modal-close" onClick={() => setBuyProd(null)}>✕</button>
              </div>
              <div className="modal-price">{buyProd.price}</div>
              {orderOk ? (
                <>
                  <div className="order-success">✅ {orderOk}</div>
                  <button className="btn-modal-secondary" onClick={() => setBuyProd(null)}>Close</button>
                </>
              ) : (
                <form className="form-grid" onSubmit={submitOrder}>
                  <label className="form-label">Full Name
                    <input className="form-input" type="text" value={buyerName} onChange={(e)=>setBuyerName(e.target.value)} placeholder="Your full name" required />
                  </label>
                  <label className="form-label">Email
                    <input className="form-input" type="email" value={buyerEmail} onChange={(e)=>setBuyerEmail(e.target.value)} placeholder="you@example.com" required />
                  </label>
                  <label className="form-label">Phone
                    <input className="form-input" type="tel" value={buyerPhone} onChange={(e)=>setBuyerPhone(e.target.value)} placeholder="Mobile number" required />
                  </label>
                  <label className="form-label">Delivery Address
                    <textarea className="form-textarea" value={buyerAddr} onChange={(e)=>setBuyerAddr(e.target.value)} placeholder="Full shipping address" required />
                  </label>
                  <label className="form-label">Quantity
                    <input className="form-input" type="number" min="1" value={qty} onChange={(e)=>setQty(Number(e.target.value))} required />
                  </label>
                  <div className="modal-actions">
                    <button className="btn-modal-primary" type="submit">Place Order</button>
                    <button className="btn-modal-secondary" type="button" onClick={() => setBuyProd(null)}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
 
      {/* ── CART MODAL ── */}
      {showCart && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setShowCart(false)} role="button" tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowCart(false)} aria-label="Close cart" />
          <div className="side-modal">
            <div className="side-modal-head">
              <h2>🛒 Your Cart ({cart.length})</h2>
              <button className="modal-close" onClick={() => setShowCart(false)}>✕</button>
            </div>
            {cart.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <p>Your cart is empty. Start shopping!</p>
              </div>
            ) : (
              <>
                <ul className="cart-list">
                  {cart.map((item, i) => (
                    <li key={`${item.name}-${i}`} className="cart-item">
                      <div className="cart-item-info">
                        <strong>{item.name}</strong>
                        <span>{item.price}</span>
                      </div>
                      <button className="btn-remove" onClick={() => removeCart(i)}>Remove</button>
                    </li>
                  ))}
                </ul>
                <div className="cart-footer">
                  <div className="cart-total-row">
                    <span className="cart-total-label">Subtotal ({cart.length} items)</span>
                    <span className="cart-total-value">{fmtINR(cartTotal)}</span>
                  </div>
                  <button className="btn-checkout">Proceed to Checkout</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
 
      {/* ── WISHLIST MODAL ── */}
      {showWish && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setShowWish(false)} role="button" tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowWish(false)} aria-label="Close wishlist" />
          <div className="side-modal">
            <div className="side-modal-head">
              <h2>❤️ Wishlist ({wishlist.length})</h2>
              <button className="modal-close" onClick={() => setShowWish(false)}>✕</button>
            </div>
            {wishlist.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🤍</div>
                <p>No items saved yet. Tap the heart on any product.</p>
              </div>
            ) : (
              <ul className="cart-list">
                {wishlist.map((item, i) => (
                  <li key={`${item.name}-${i}`} className="cart-item">
                    <div className="cart-item-info">
                      <strong>{item.name}</strong>
                      <span>{item.price}</span>
                    </div>
                    <button className="btn-remove" onClick={() => toggleWish(item)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
 
      {/* ── LOGIN MODAL ── */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setShowLogin(false)} role="button" tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowLogin(false)} aria-label="Close login" />
          <div className="login-box">
            <div className="modal-header">
              <div>
                <div className="login-logo">Shoply<span>.</span></div>
                <p className="login-subtitle">Sign in for a personalised experience</p>
              </div>
              <button className="modal-close" onClick={() => setShowLogin(false)}>✕</button>
            </div>
            <form className="login-form" onSubmit={submitLogin}>
              <label className="form-label">Email address
                <input className="form-input" type="email" value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} placeholder="you@example.com" required />
              </label>
              <label className="form-label">Password
                <input className="form-input" type="password" value={loginPass} onChange={(e)=>setLoginPass(e.target.value)} placeholder="Enter your password" required />
              </label>
              <button className="btn-login" type="submit">Sign In</button>
            </form>
          </div>
        </div>
      )}

      {/* ── TRACKING MODAL ── */}
      {showTracking && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setShowTracking(false)} role="button" tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowTracking(false)} aria-label="Close tracking" />
          <div className="side-modal">
            <div className="side-modal-head">
              <h2>📦 Order Tracking ({orders.length})</h2>
              <button className="modal-close" onClick={() => setShowTracking(false)}>x</button>
            </div>
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>No orders yet. Start shopping!</p>
              </div>
            ) : (
              <ul className="orders-list">
                {orders.map((order, i) => {
                  const ageHours = (new Date() - order.orderDate) / (1000 * 60 * 60);
                  const status = getTrackingStatus(ageHours);
                  return (
                    <li key={order.orderId} className="order-card">
                      <div className="order-header">
                        <div>
                          <strong className="order-id">{order.orderId}</strong>
                          <span className="order-product">{order.product}</span>
                        </div>
                        <button className="btn-expand" onClick={() => setSelectedOrder(selectedOrder === i ? null : i)}>
                          {selectedOrder === i ? "←" : "→"}
                        </button>
                      </div>
                      <div className="order-status" style={{ borderLeftColor: status.color }}>
                        <span style={{ color: status.color }}>{status.icon} {status.text}</span>
                        <span className="order-date">{order.estimatedDelivery}</span>
                      </div>
                      {selectedOrder === i && (
                        <div className="order-details">
                          <p><strong>Item:</strong> {order.quantity} x {order.product}</p>
                          <p><strong>Price:</strong> {order.price}</p>
                          <p><strong>Buyer:</strong> {order.buyer}</p>
                          <p><strong>Phone:</strong> {order.phone}</p>
                          <p><strong>Address:</strong> {order.address}</p>
                          <p><strong>Est. Delivery:</strong> {order.estimatedDelivery}</p>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: Math.min(ageHours * 10, 100) + "%", backgroundColor: status.color }}></div>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}