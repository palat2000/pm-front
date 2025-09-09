export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>header auth layout</div>
      {children}
    </div>
  );
}
