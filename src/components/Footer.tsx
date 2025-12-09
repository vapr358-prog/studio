import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Sweet Queen. Todos los derechos reservados.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="#" className="hover:text-primary transition-colors">
            Política de Privacidad
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Términos de Servicio
          </Link>
        </div>
      </div>
    </footer>
  );
}
