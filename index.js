const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "Hyperteam-byte";
const REPO_NAME = "hyper.lua";
const FILE_PATH = "HyperTeam-Key.txt";

function generateKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'HyperTeam-';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

app.get('/lootlabs-webhook', async (req, res) => {
    try {
        const newKey = generateKey();
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

        const getFile = await axios.get(url, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        const sha = getFile.data.sha;
        const currentContent = Buffer.from(getFile.data.content, 'base64').toString('utf-8');
        
        const updatedContent = currentContent + `\n${newKey}`;
        const encodedContent = Buffer.from(updatedContent).toString('base64');

        await axios.put(url, {
            message: `Auto Key: ${newKey}`,
            content: encodedContent,
            sha: sha
        }, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        res.status(200).send(`
            <div style="font-family:sans-serif; text-align:center; padding:50px;">
                <h1>🎉 Key'iniz Oluşturuldu!</h1>
                <p>Aşağıdaki key'i kopyalayıp oyuna yapıştırın:</p>
                <h2 style="background:#eee; padding:15px; display:inline-block;">${newKey}</h2>
            </div>
        `);
    } catch (error) {
        res.status(500).send("Hata oluştu.");
    }
});

app.listen(3000, () => console.log("Ready!"));
