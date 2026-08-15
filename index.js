const axios = require('axios');
module.exports = async (req, res) => {
    const response = await axios.get("https://raw.githubusercontent.com/mhamadrebwar3600-dev/IPTV-Kurdi/refs/heads/main/channels%20(2).m3u");
    res.setHeader('Content-Type', 'audio/x-mpegurl');
    res.send(response.data);
};
