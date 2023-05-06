import React, { useEffect } from 'react';

const AdsterraAd = () => {
  const adsterraDataKey = process.env.REACT_APP_ADSTERRA_DATA_KEY;

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://www.profitabledisplaynetwork.com/${adsterraDataKey}/invoke.js`;
    script.async = true;

    const adContainer = document.getElementById('adsterra-ad-container');
    adContainer.dataset.key = adsterraDataKey;
    adContainer.appendChild(script);

    return () => {
      adContainer.removeChild(script);
    };
  }, [adsterraDataKey]);

  return (
    <div id="adsterra-ad-container" data-format="iframe" data-height="250" data-width="300"></div>
  );
};

export default AdsterraAd;
