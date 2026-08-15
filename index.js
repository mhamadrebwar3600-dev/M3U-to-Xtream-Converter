const express = require('express');
const axios = require('axios');
const app = express();

const M3U_URL = "https://raw.githubusercontent.com/mhamadrebwar3600-dev/IPTV-Kurdi/refs/heads/main/channels%20(2).m3u";

// شیکارکردنی فایلی M3U
async function parseM3U() {
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
                    stream_id: String(id),
                    stream_icon: "",
                    category_id: "1",
                    direct_source: streamUrl
                });
                id++;
            }
        }
    }
    return channels;
}

// API سەرەکی Xtream
app.get('/player_api.php', async (req, res) => {
    const action = req.query.action;
    const channels = await parseM3U();

    // ئەگەر داوای کاتێگۆرییەکان بکات
    if (action === 'get_live_categories') {
        return res.json([{ category_id: "1", category_name: "Live Channels", parent_id: 0 }]);
    }

    // ئەگەر داوای لیستەی کەناڵەکان بکات
    if (action === 'get_live_streams') {
        return res.json(channels);
    }

    // Loginی سەرەتایی
    res.json({
        user_info: {
            username: req.query.username || "one2",
            password: req.query.password || "9501000",
            message: "Active",
            auth: 1,
            status: "Active",
            exp_date: "1999999999",
            is_trial: "0",
            active_cons: "1",
            created_at: "1600000000",
            max_connections: "10"
        },
        server_info: {
            url: req.hostname,
            port: "80",
            https_port: "443",
            server_protocol: "https"
        }
    });
});

// ڕێڕەوی لێدانی کەناڵەکان (Stream Redirect)
app.get('/live/:username/:password/:stream_id', async (req, res) => {
    const channels = await parseM3U();
    const target = channels.find(c => c.stream_id === req.params.stream_id);
    if (target && target.direct_source) {
        res.redirect(target.direct_source);
    } else {
        res.status(404).send("Stream not found");
    }
});

module.exports = app;
