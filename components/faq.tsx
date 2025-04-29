"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { HelpCircle, Package, Truck, Plane, Clock, Shield, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Spotlight } from "@/lib/aceternity-ui"
import { useTheme } from "next-themes"

// Replace the entire component with this enhanced version
export default function Faq() {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const { theme } = useTheme()

  const faqs = [
    {
      question: "How do I track my package?",
      answer:
        "You can track your package by entering your tracking number in the tracking field on our homepage. You'll receive real-time updates on your package's location and estimated delivery time.",
      icon: <Package className="h-5 w-5" />,
    },
    {
      question: "What shipping options do you offer?",
      answer:
        "We offer a variety of shipping options including standard delivery (3-5 business days), express delivery (1-2 business days), and same-day delivery in select areas. International shipping options are also available with varying timeframes depending on the destination.",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      question: "How are shipping costs calculated?",
      answer:
        "Shipping costs are calculated based on package weight, dimensions, shipping distance, and the selected service type. Additional factors may include special handling requirements, insurance, and customs fees for international shipments.",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      question: "Do you offer insurance for valuable items?",
      answer:
        "Yes, we offer shipping insurance for valuable items. The insurance cost is typically a percentage of the declared value. We recommend insuring all high-value shipments to protect against loss or damage during transit.",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      question: "What items are prohibited from shipping?",
      answer:
        "Prohibited items include hazardous materials, illegal substances, firearms, ammunition, perishable goods without proper packaging, and certain electronics with lithium batteries. Please contact our customer service for a complete list of restricted items.",
      icon: <HelpCircle className="h-5 w-5" />,
    },
    {
      question: "How do I schedule a pickup?",
      answer:
        "You can schedule a pickup through our website by filling out the shipping form and selecting the 'Schedule Pickup' option. Alternatively, you can call our customer service to arrange a pickup at your convenience.",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      question: "What should I do if my package is damaged or lost?",
      answer:
        "If your package is damaged or lost, please contact our customer support immediately with your tracking number. We'll initiate an investigation and work to resolve the issue as quickly as possible. For insured packages, we'll guide you through the claims process.",
      icon: <Package className="h-5 w-5" />,
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we offer international shipping to over 200 countries. International shipping times vary depending on the destination, customs processing, and the selected service level. All international shipments require proper documentation.",
      icon: <Plane className="h-5 w-5" />,
    },
  ]

  return (
    <section id="faq" className="py-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-muted/50 dark:bg-background/30 z-0"></div>
      <Spotlight
        className="-top-40 left-0 md:left-60"
        fill={theme === "dark" ? "hsl(var(--primary)/0.2)" : "hsl(var(--primary)/0.1)"}
      />

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <div className="space-y-2 relative">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to common questions about our shipping services
            </p>
            <div className="absolute -z-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl top-0 right-1/4"></div>
          </div>
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <Card className="border border-primary/10 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <Accordion
                type="multiple"
                value={expandedItems}
                onValueChange={setExpandedItems}
                className="w-full space-y-4"
              >
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <AccordionItem
                      value={`item-${index}`}
                      className={cn(
                        "border border-primary/10 underline-none no-underline rounded-lg overflow-hidden shadow-sm",
                        "data-[state=open]:bg-primary/5 data-[state=open]:shadow-md",
                        "transition-all duration-200",
                      )}
                    >
                      <AccordionTrigger className="px-6 underline-none no-underline py-4 hover:bg-primary/5 group">
                        <div className="flex items-center gap-3 text-left">
                          <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                            {faq.icon}
                          </div>
                          <span className="font-medium no-underline">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 pt-2 text-muted-foreground">
                        <div className="pl-11">{faq.answer}</div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <p className="text-muted-foreground">
              Can't find what you're looking for?{" "}
              <span className="text-primary font-medium">Contact our customer support team</span> for assistance.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
