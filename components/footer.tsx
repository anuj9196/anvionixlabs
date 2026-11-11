import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY } from "@/data/company";

export function Footer() {
  return (
    <footer id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4">{COMPANY.name}</h3>
            <p className="text-muted-foreground max-w-md">
              Building innovative digital solutions that transform the way people work and interact.
            </p>
            <p className="text-muted-foreground max-w-md mt-4">
              Our brands:{" "}
              {COMPANY.brands.map((brand, i) => (
                <span key={brand.url}>
                  {i > 0 && ", "}
                  <a href={brand.url} className="font-medium text-foreground hover:text-primary transition-colors">
                    {brand.name}
                  </a>
                </span>
              ))}
            </p>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <MapPin className="size-5 shrink-0 mt-0.5" aria-hidden="true" />
                <address className="not-italic">
                  {COMPANY.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex gap-3">
                <Phone className="size-5 shrink-0" aria-hidden="true" />
                <a href={COMPANY.phoneHref} className="hover:text-primary transition-colors">
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="size-5 shrink-0" aria-hidden="true" />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-primary transition-colors">
                  {COMPANY.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-right text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
