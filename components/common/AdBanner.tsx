'use client';

export default function AdBanner() {
  const adHtml = `
    <!DOCTYPE html> 
    <html> 
      <head> 
        <style> 
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; } 
        </style> 
      </head> 
      <body> 
        <script type="text/javascript"> 
          atOptions = { 'key' : '5526ec19aab62cb0247bb058111272b7', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} }; 
        </script> 
        <script type="text/javascript" src="//www.highperformanceformat.com/5526ec19aab62cb0247bb058111272b7/invoke.js"></script> 
      </body> 
    </html>
  `;

  return (
    <div className="w-full flex justify-center">
      <iframe
        srcDoc={adHtml}
        width="300"
        height="250"
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
        title="Advertisement"
      />
    </div>
  );
}
