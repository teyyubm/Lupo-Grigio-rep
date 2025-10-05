# Universal Hosting Configuration
# Lupo Grigio - Works on Any Hosting Provider

## 🌐 **Hosting Provider Options**

### **Shared Hosting (cPanel, etc.)**
Upload these files to your web root:
- `index.html` (main page)
- `privacy.html` (privacy policy)
- `terms.html` (terms of service)
- `admin/` folder (admin panel)
- `assets/` folder (styles, scripts, images)
- `save-products.php` (for admin functionality)

### **VPS/Dedicated Server**
1. Upload all files to `/var/www/html/` or your web directory
2. Ensure PHP is enabled for admin functionality
3. Set proper file permissions (755 for folders, 644 for files)

### **GitHub Pages**
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Note: Admin panel won't work (no PHP support)

### **Vercel**
1. Connect your GitHub repository
2. Deploy automatically
3. Admin panel will work with serverless functions

## 🔧 **Required Files for Any Hosting**

### **Essential Files:**
```
/
├── index.html              # Main website
├── privacy.html           # Privacy policy
├── terms.html             # Terms of service
├── admin/
│   └── index.html         # Admin panel
├── assets/
│   ├── styles/
│   │   ├── main.css       # Main styles
│   │   └── theme.css      # Theme variables
│   ├── scripts/
│   │   ├── app.js         # Main JavaScript
│   │   ├── config.js      # Configuration
│   │   └── analytics-config.js # Analytics setup
│   ├── images/            # All images
│   └── data/
│       └── products.json  # Product data
└── save-products.php      # Admin functionality (if using PHP)
```

## ⚙️ **Configuration Steps**

### **1. Update Analytics**
In `index.html`, replace `GA_MEASUREMENT_ID` with your actual Google Analytics ID:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ACTUAL-ID"></script>
```

### **2. Update Contact Information**
In `index.html`, update phone numbers and email addresses:
```html
<p>+994 12 345 67 89<br>+994 50 123 45 67</p>
<p>info@lupogrigio.az<br>sifaris@lupogrigio.az</p>
```

### **3. Update Domain URLs**
Replace placeholder URLs with your actual domain:
```html
<meta property="og:url" content="https://yourdomain.com" />
```

## 🔒 **SSL Setup (Any Hosting)**

### **Let's Encrypt (Free SSL)**
Most hosting providers offer free SSL certificates:
1. **cPanel**: Look for "SSL/TLS" or "Let's Encrypt"
2. **VPS**: Install Certbot: `sudo certbot --nginx`
3. **Cloudflare**: Free SSL with CDN

### **Force HTTPS Redirect**
Add to `.htaccess` file (Apache) or server config:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 📱 **Mobile Optimization**

Your site is already mobile-responsive! Test on:
- iPhone Safari
- Android Chrome
- iPad Safari
- Various screen sizes

## 🚀 **Deployment Checklist**

- [ ] Upload all files to hosting
- [ ] Test main page loads correctly
- [ ] Test admin panel functionality
- [ ] Update analytics ID
- [ ] Update contact information
- [ ] Configure SSL certificate
- [ ] Test on mobile devices
- [ ] Check all links work
- [ ] Verify images load properly

## 🆘 **Troubleshooting**

### **Admin Panel Not Working**
- Ensure PHP is enabled on your hosting
- Check file permissions (755 for folders, 644 for files)
- Verify `save-products.php` is in root directory

### **Images Not Loading**
- Check file paths are correct
- Ensure images are uploaded to `assets/images/`
- Verify file permissions

### **Styles Not Loading**
- Check CSS file paths
- Clear browser cache
- Verify files uploaded correctly

## 📞 **Support**

If you need help with deployment:
1. Check your hosting provider's documentation
2. Test files locally first
3. Use browser developer tools to debug issues
4. Contact your hosting provider's support
