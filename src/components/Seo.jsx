import React from 'react';
import { Helmet } from 'react-helmet-async';

const DEFAULT_SITE_URL = 'https://webprompt.app/';
const DEFAULT_IMAGE = `${DEFAULT_SITE_URL}logo.webp`;
const PRIMARY_BRAND = 'WebPrompt';
const ALT_BRAND = 'PromptVibely';

const Seo = ({ title, description, keywords, canonical, image }) => {
    const pageTitle = title
        ? `${title} | ${ALT_BRAND}`
        : `${ALT_BRAND} | ${PRIMARY_BRAND} | Prompt Web App & AI Prompt Studio`;
    const pageDescription = description
        ? description
        : `${ALT_BRAND} (aka ${PRIMARY_BRAND}) is the prompt web app to plan, build, and ship AI prompts for ChatGPT, Claude, and Gemini.`;
    const pageKeywords = keywords
        ? `${keywords}, ${ALT_BRAND.toLowerCase()}, webprompt, prompt web app, ai prompt builder, prompt engineering tool, prompt generator, prompt upgrader, json prompt builder, ai prompt formatter`
        : `${ALT_BRAND.toLowerCase()}, webprompt, prompt web app, prompt builder, ai prompt generator, prompt engineering, prompt engineering tool, prompt upgrader, json prompt builder, ai prompt formatter, prompt ops, prompt automation`;
    const pageUrl = canonical || DEFAULT_SITE_URL;
    const imageUrl = image || DEFAULT_IMAGE;

    return (
        <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={pageKeywords} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={pageUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:site_name" content={ALT_BRAND} />
            <meta property="og:image" content={imageUrl} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={pageUrl} />
            <meta property="twitter:title" content={pageTitle} />
            <meta property="twitter:description" content={pageDescription} />
            <meta property="twitter:image" content={imageUrl} />
        </Helmet>
    );
};

export default Seo;
