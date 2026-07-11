export function PageIntro({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-line bg-surface">
      <div className="container-page py-14 md:py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl">{title}</h1>
          {subtitle && <p className="prose-muted mt-4 text-lg">{subtitle}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
