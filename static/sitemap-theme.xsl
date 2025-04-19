<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
  <html>
    <head>
      <title>Sitemap : aristide-bh.com</title>
      <style type="text/css">
        body {
          font-family: Arial, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #eee; /* Light text color for dark background */
          background-color: #121212; /* Dark background color */
        }
        table {
          width: 100%;
          border-collapse: collapse;
          color: #eee; /* Light text color for dark background */
        }
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #444; /* Darker border color */
        }
        th {
          background-color: #333; /* Darker header background */
          color: #fff; /* White header text */
        }
        a {
          color: #7153F9; /* Accent link color */
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
          color: #9a87ff; /* Lighter accent color on hover */
        }
      </style>
    </head>
    <body>
      <h1>Sitemap</h1>
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>Last Modified</th>
            <th>Change Frequency</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          <xsl:for-each select="//sitemap:url">
            <tr>
              <td>
                <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
              </td>
              <td><xsl:value-of select="sitemap:lastmod"/></td>
              <td><xsl:value-of select="sitemap:changefreq"/></td>
              <td><xsl:value-of select="sitemap:priority"/></td>
            </tr>
          </xsl:for-each>
        </tbody>
      </table>
    </body>
  </html>
</xsl:template>

</xsl:stylesheet>
