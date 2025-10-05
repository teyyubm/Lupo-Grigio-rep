# SSL Certificate Configuration Guide
# Lupo Grigio - Production Security Setup

## 🔒 **SSL Certificate Requirements**

Your website MUST use HTTPS in production for:
- **Security**: Encrypt data transmission
- **SEO**: Google ranks HTTPS sites higher
- **Trust**: Browser security indicators
- **Modern Features**: Service workers, geolocation, etc.

## 🌐 **Hosting Provider SSL Setup**

### **Netlify (Recommended)**
```toml
# netlify.toml - Already configured
[build]
  publish = "."
  functions = "serverless/netlify/functions"

# Force HTTPS redirects
[[redirects]]
  from = "http://lupogrigio.netlify.app/*"
  to = "https://lupogrigio.netlify.app/:splat"
  status = 301
  force = true

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### **Vercel**
```json
// vercel.json - Update existing file
{
  "outputDirectory": ".",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "https://lupogrigio.vercel.app/$1",
      "permanent": true,
      "has": [
        {
          "type": "header",
          "key": "x-forwarded-proto",
          "value": "http"
        }
      ]
    }
  ]
}
```

### **Shared Hosting (cPanel)**
1. **Enable SSL in cPanel**
   - Go to "SSL/TLS" section
   - Click "Let's Encrypt" or "AutoSSL"
   - Enable for your domain

2. **Force HTTPS Redirect**
   - Add to `.htaccess` file:
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set X-XSS-Protection "1; mode=block"
```

## 🔍 **SSL Testing Checklist**

### **Before Launch:**
- [ ] SSL certificate installed and active
- [ ] HTTPS redirects working (HTTP → HTTPS)
- [ ] Mixed content warnings resolved
- [ ] Security headers configured
- [ ] SSL Labs test score A+ (https://www.ssllabs.com/ssltest/)

### **Test Your SSL:**
1. **Visit your site**: `https://yourdomain.com`
2. **Check browser**: Look for lock icon in address bar
3. **Test redirect**: Visit `http://yourdomain.com` (should redirect to HTTPS)
4. **SSL Labs**: Run test at https://www.ssllabs.com/ssltest/

## ⚠️ **Common SSL Issues**

### **Mixed Content Warnings**
- Ensure all images, scripts, and stylesheets use HTTPS
- Update any hardcoded HTTP URLs in your code

### **Certificate Chain Issues**
- Use full certificate chain, not just the certificate
- Include intermediate certificates

### **Expiration Monitoring**
- Set up certificate expiration alerts
- Most providers auto-renew, but verify this

## 🚀 **Production Deployment Steps**

1. **Choose hosting provider** (Netlify/Vercel recommended)
2. **Configure SSL** using provider's tools
3. **Update domain settings** to point to hosting
4. **Test SSL configuration** thoroughly
5. **Monitor certificate status** regularly

## 📞 **Support**

If you encounter SSL issues:
- Check hosting provider's SSL documentation
- Use SSL Labs testing tool
- Contact hosting support for certificate issues
