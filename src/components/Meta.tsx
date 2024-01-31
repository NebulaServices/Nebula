import { Helmet } from "react-helmet";
export default function Meta() {
  return (
    <Helmet>
      <meta name="googlebot" content="index, follow, snippet" />
      <link rel="canonical" href="https://nebulaproxy.io/" />
      <meta
        name="keywords"
        content="proxy, web proxy, unblock websites, unblock chromebook, free web proxy, proxy list, proxy sites, un block chromebook, online proxy, proxy server, proxysite, proxy youtube, bypass securly, bypass iboss, bypass lightspeed filter, chromebooks, titanium network, unblock youtube, youtube proxy, unblocked youtube, youtube unblocked"
      />
      <meta
        name="description"
        content="NebulaWeb is an official flagship of Nebula Services and Nebula Developer Labs. NebulaWeb is a stunning, sleek, and functional web-proxy with support for thousands of popular sites. With NebulaWeb, the sky is the limit."
      />
      <meta property="og:site_name" content="Nebula" />
      <meta property="og:url" content="https://nebulaproxy.io/" />
      <meta property="og:title" content="Nebula" />
      <meta property="og:image" content="/logo.png" />
      <meta property="og:image:secure_url" content="/logo.png" />
      <meta property="og:type" content="website" />
      <meta name="color-scheme" content="light dark" />
      <meta property="og:title" content="Nebula" />
      <meta
        content="A stunning and sleak web proxy frontend with support for hundreds of popular sites."
        property="og:description"
      />
      <meta name="theme-color" content="#191724" />
      <script type="application/ld+json">
        {`
            {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Nebula",
            "url": "https://nebulaproxy.io",
            "sameAs": [
                "https://github.com/NebulaServices",
                "https://nebulaproxy.io"
            ]
        }
            `}
      </script>
      <script type="application/ld+json">
        {`
           {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{
                "@type": "Question",
                "name": "How do I get more links?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can more links by joining our discord server at discord.gg/unblocker"
                }
            }, {
                "@type": "Question",
                "name": "How can I self host Nebula?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Instructions for self hosting Nebula can be found at our GitHub repository."
                }
            }, {
                "@type": "Question",
                "name": "What sites can I unblock with Nebula?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "With Nebula you can access sites such as Discord, Spotify, YouTube and other game sites!"
                }
            },  {
                "@type": "Question",
                "name": "Does Nebula hide my search history?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Change your Tab appearance in Settings and make the tab look like another site!."
                }
            }, {
                "@type": "Question",
                "name": "Is Nebula open-source?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Check out our GitHub where you can deploy or host your own instance of Nebula."
                }
            }]
           }
            `}
      </script>
    </Helmet>
  );
}
