import { Metadata } from 'next';
import './globals.css';
import Nav from './nav';

export const metadata: Metadata = {
  title: 'Shad',
  description: 'GPXファイルの斜度を可視化するWebアプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head />
      <body>
        <div id="app-wrapper">
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}
