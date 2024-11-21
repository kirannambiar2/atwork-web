import React from 'react';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        h1, h2 {
          color: #0056b3;
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
        }
        h2 {
          margin-top: 30px;
        }
        p, ul {
          margin: 10px 0;
        }
        ul {
          padding-left: 20px;
        }
        a {
          color: #0056b3;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      `}</style>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        <div className="prose max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
} 