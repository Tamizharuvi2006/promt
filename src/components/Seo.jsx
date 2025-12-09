import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title ? `${title} | WebPrompt` : 'WebPrompt - AI Prompt Engineering Studio'}</title>
            <meta name="description" content={description || "Build perfect AI prompts in seconds with WebPrompt.app. The ultimate prompt engineering tool for Developers and Creators."} />
            <meta name="keywords" content={keywords ? `${keywords}, webprompt, promptweb, prompt maker, ai prompt generator` : "webprompt, promptweb, prompt maker, ai prompt generator, prompt engineering, pixcy.dev"} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://webprompt.app/" />
            <meta property="og:title" content={title ? `${title} | WebPrompt` : 'WebPrompt - AI Prompt Engineering Studio'} />
            <meta property="og:description" content={description || "Build perfect AI prompts in seconds with WebPrompt.app."} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="https://webprompt.app/" />
            <meta property="twitter:title" content={title ? `${title} | WebPrompt` : 'WebPrompt - AI Prompt Engineering Studio'} />
            <meta property="twitter:description" content={description || "Build perfect AI prompts in seconds with WebPrompt.app."} />
        </Helmet>
    );
};

export default Seo;
