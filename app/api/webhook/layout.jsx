export const metadata = {
  title: 'Manifesto Pieces',
  description: 'Order Command Center',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}