import React, { useEffect, useState } from 'react';
import XMLViewer from 'react-xml-viewer'


const SitemapGenerator = () => {
    const [sitemap, setSitemap] = useState([]);
    const baseurl = window.location.origin

    
    useEffect(() => {
        // Define your website's routes
        const routes = [
          '/',
          '/terms',
          '/privacyPolicy',
          '/frames',
          '/orders',
          '/my-account',
          '/thank-you',
        ];
    
        // Generate the sitemap URLs based on your routes
        const sitemapUrls = routes.map(route => ({
          url: route,
          lastmod: new Date().toISOString(), // You can update this with the last modified date of each page
        }));
    
        setSitemap(sitemapUrls);
      }, []);

      const renderSitemapXML = () => {
        const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
        const urlsetStart = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        const urlsetEnd = '</urlset>';
    
        const urlElements = sitemap.map(url => {
          return `
            <url>
              <loc>${baseurl + url.url}</loc>
              <lastmod>${url.lastmod}</lastmod>
            </url>
          `;
        });
    
        return xmlHeader + urlsetStart + urlElements.join('') + urlsetEnd;
      };

      return (
        <>
         <XMLViewer xml={renderSitemapXML()} />
       
        </>
      )
}

export default SitemapGenerator;