"use client"

import type React from "react"
import Link from "next/link"
import { 
  Github, 
  Twitter, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin 
} from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t bg-background">
      <div>
        <div className="py-12 px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Greenroute Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Fast, reliable package delivery services for businesses and individuals.
              </p>
              <div className="flex space-x-4">
                <Link 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/track" className="text-muted-foreground hover:text-foreground transition-colors">
                    Track Package
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/services/domestic" className="text-muted-foreground hover:text-foreground transition-colors">
                    Domestic Shipping
                  </Link>
                </li>
                <li>
                  <Link href="/services/international" className="text-muted-foreground hover:text-foreground transition-colors">
                    International Shipping
                  </Link>
                </li>
                <li>
                  <Link href="/services/express" className="text-muted-foreground hover:text-foreground transition-colors">
                    Express Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/services/ecommerce" className="text-muted-foreground hover:text-foreground transition-colors">
                    E-commerce Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/services/business" className="text-muted-foreground hover:text-foreground transition-colors">
                    Business Shipping
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    123 Delivery Street<br />
                    Shipping City, 12345<br />
                    United States
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                  <a href="tel:+1234567890" className="text-muted-foreground hover:text-foreground transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                  <a href="mailto:info@Greenroute Delivery.com" className="text-muted-foreground hover:text-foreground transition-colors">
                    info@Greenroute Delivery.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t py-6 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Greenroute Delivery. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
