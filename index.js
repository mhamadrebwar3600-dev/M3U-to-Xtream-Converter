const express = require('express');
const axios = require('axios');
const app = express();

// لینکی M3Uەکەی خۆت لێرە دابنێ
const M3U_URL = "https://raw.githubusercontent.com/mhamadrebwar3600-dev/IPTV-Kurdi/refs/heads/main/channels%20(2).m3u";

app.get('/player_api.php', async (req, res) => {
    try {
        const response = await axios.get(M3U_URL);
        const lines = response.data.split('\n');
        let channels = [];
        let id = 1;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('#EXTINF:')) {
                let name = lines[i].split(',')[1] || "Channel";
                let streamUrl = lines[i + 1] ? lines[i + 1].trim() : "";
                if (streamUrl && !streamUrl.startsWith('#')) {
                    channels.push({
                        num: id,
                        name: name.trim(),
                        stream_id: id,
                        stream_icon: "",
                        category_id: "1",
                        direct_source: streamUrl
                    });
                    id++;
                }
            }
        }

        res.json({
            user_info: {
                username: req.query.username || "one2",
                password: req.query.password || "9501000",
                status: "Active",
                exp_date: "1999999999",
                auth: 1
            },
            categories: [{ category_id: "1", category_name: "Live Channels" }],
            available_channels: channels
        });
    } catch (e) {
        res.status(500).send("Error fetching M3U");
    }
});

module.exports = app;
