import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Contact() {
  return (
    <section id="contact" className="py-16 relative">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Have questions or need assistance? Reach out to our customer support team.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Get in Touch</h3>
              <p className="text-muted-foreground">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Input placeholder="Full Name" required />
                </div>
                <div className="space-y-2">
                  <Input type="email" placeholder="Email Address" required />
                </div>
              </div>
              <div className="space-y-2">
                <Input placeholder="Subject" required />
              </div>
              <div className="space-y-2">
                <Textarea placeholder="Your Message" className="min-h-[150px]" required />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Contact Information</h3>
              <p className="text-muted-foreground">You can also reach us using the following contact details.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card className="overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-lg dark:bg-primary/5 bg-primary/5 dark:hover:bg-primary/5 group">
                <CardContent className="flex flex-col items-center p-4 text-center relative z-10">
                  <div className="rounded-full bg-primary/20 p-3 mb-3 group-hover:bg-primary/30 transition-colors">
                    <MapPin className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Our Location</h4>
                  <p className="text-muted-foreground text-sm">
                    123 Logistics Way
                    <br />
                    Shipping City, SC 12345
                    <br />
                    United States
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-lg dark:bg-primary/5 bg-primary/5 dark:hover:bg-primary/5 group">
                <CardContent className="flex flex-col items-center p-4 text-center relative z-10">
                  <div className="rounded-full bg-primary/20 p-3 mb-3 group-hover:bg-primary/30 transition-colors">
                    <Phone className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Phone Number</h4>
                  <p className="text-muted-foreground text-sm">
                    Customer Support:
                    <br />
                    +1 (555) 123-4567
                    <br />
                    Business Inquiries:
                    <br />
                    +1 (555) 765-4321
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-lg dark:bg-primary/5 bg-primary/5 dark:hover:bg-primary/5 group">
                <CardContent className="flex flex-col items-center p-4 text-center relative z-10">
                  <div className="rounded-full bg-primary/20 p-3 mb-3 group-hover:bg-primary/30 transition-colors">
                    <Mail className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Email Address</h4>
                  <p className="text-muted-foreground text-sm">
                    Customer Support:
                    <br />
                    support@deliveryuno.com
                    <br />
                    Business Inquiries:
                    <br />
                    info@deliveryuno.com
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-lg dark:bg-primary/5 bg-primary/5 dark:hover:bg-primary/5 group">
                <CardContent className="flex flex-col items-center p-4 text-center relative z-10">
                  <div className="rounded-full bg-primary/20 p-3 mb-3 group-hover:bg-primary/30 transition-colors">
                    <Clock className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Business Hours</h4>
                  <p className="text-muted-foreground text-sm">
                    Monday - Friday:
                    <br />
                    8:00 AM - 8:00 PM
                    <br />
                    Saturday:
                    <br />
                    9:00 AM - 5:00 PM
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
