
const delay = 2;
const pause = 2;

const trackmania = {
    session: '<session ID>',
    playerlogin: '<login>',
    lang: 'fr',
    nickname: '<nickname>',
    path: 'World|France|Poitou-Charentes|Charente',
}

/////////////////////////////////////////

import crypto from 'crypto';
import readline from 'readline';

const link = `http://manialoto.net/clickladder/game.php?playerlogin=${trackmania.playerlogin}&lang=${trackmania.lang}&nickname=${trackmania.nickname}&path=${trackmania.path}&sess=${trackmania.session}`;
const newlink = `http://manialoto.net/clickladder/game.php?zoneindextop=0&code=<code>&playerlogin=${trackmania.playerlogin}&lang=${trackmania.lang}&nickname=${trackmania.nickname}&path=${trackmania.path}&sess=${trackmania.session}`;
const pos = [
    'b8bf97aedbd3108cfc2ddb131901066c',  // top left
    'c1cdd29c258437a33382c45e82b70218',  // top
    '945dc65d93adf827871ae86902c42676',  // top right
    'c4f2a5f337c13a99c14dcda9565fe454',  // left
    '6a3cf239ce688698b1fe5729b1e7ccb4',  // mid
    'e654a801b0e4673f8c070ac7470bacbc',  // right
    'ba4d324a8d6ed4a8d8c30810a79be740',  // bottom left
    'e26e4190d613f17b3544429523872138',  // bottom
    'c89933bd8631ee48858935ae9ebb5d70',  // bottom right
]
const color = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    bold: '\x1b[1m',
}

console.clear();
process.stdout.write('\x1B[?25l'); // hide cursor

const started = new Date();
let totalClick = 0;
let totalSession = 0;
let totalPause = 0;

// Init display
process.stdout.write(`${color.gray}` +
    '+------------------------------------+\n' +
    '|   MANIALOTO CLICKLADDER  BOT 0.1   |\n' +
    '+---------+--------------------------+\n' +
    '| Date    | -                        |\n' +
    '| Click   | -                        |\n' +
    '+---------+--------------------------+\n' +
    '| Since   | -                        |\n' +
    '| Session | -                        |\n' +
    '+---------+--------------------------+\n' +
    '| Pause   | -                        |\n' +
    '| Status  | -                        |\n' +
    '+---------+--------------------------+\n' +
    '| Click/s | -                        |\n' +
    '| Click/m | -                        |\n' +
    '| Click/h | -                        |\n' +
    '| Click/d | -                        |\n' +
    '+---------+--------------------------+'
);
const indexInfo = 12;   // start info text
const lengthInfo = 24;  // length max info

async function run(url) {

    try {

        const data = await fetch(url);
        const text = await data.text();

        const total = getTotal(text);
        if(total != -1) {
            totalClick = total;
        }
        
        const image = getImage(text);

        await sleep(1000);

        const md5 = await getmd5(image);
        const codes = getCode(text);
        
        let code;
        for(let i=0; i<9; i++) {
            if(pos[i] == md5) {
                code = codes[i];
                break;
            }
        }

        // update display
        display('running');


        // Next
        setTimeout( () => {
            const newUrl = newlink.replace('<code>', code);
            run(newUrl);
            totalSession++;
        }, (delay-1)*1_000);

    } catch(e) {

        totalPause++;

        // update display
        display('PAUSED');

        // pause
        await sleep(pause*60_000); // min

        // rerun
        run(link);
    }
}
function datenow() {
    const d = new Date();
    let date = d.getDate(); if(date < 10){ date = `0${date}`; }
    let month = d.getMonth() + 1; if(month < 10){ month = `0${month}`; }
    let hour = d.getHours(); if(hour < 10){ hour = `0${hour}`; }
    let minute = d.getMinutes(); if(minute < 10){ minute = `0${minute}`; }
    let second = d.getSeconds(); if(second < 10){ second = `0${second}`; }

    return `${date}/${month} ${hour}:${minute}:${second}`;
}
function getImage(data) {
    const startLink = 'http://www.manialoto.net/clickladder/png.php?code=';
    const dataTemp = data.split(startLink);
    const temp = dataTemp[1];
    const url = temp.slice(0, temp.indexOf('"'));
    return `${startLink}${url}`;
}
async function getmd5(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const hash = crypto.createHash("md5");
    for await (const chunk of res.body) {
        hash.update(chunk);
    }
    return hash.digest("hex");
}
function getCode(text) {
    const caseAtemp = text.split('<quad posn="-17 -7 0" sizen="15 15" halign="center" valign="center" addplayerid="1" manialink="ClickLadder?zoneindextop=0&amp;code=');
    const code1 = caseAtemp[1].slice(0, caseAtemp[1].indexOf('"'));

    const caseBtemp = text.split('<quad posn="0 -7 0" sizen="15 15" halign="center" valign="center" addplayerid="1" manialink="ClickLadder?zoneindextop=0&amp;code=');
    const code2 = caseBtemp[1].slice(0, caseBtemp[1].indexOf('"'));

    const caseCtemp = text.split('<quad posn="17 -7 0" sizen="15 15" halign="center" valign="center" addplayerid="1" manialink="ClickLadder?zoneindextop=0&amp;code=');
    const code3 = caseCtemp[1].slice(0, caseCtemp[1].indexOf('"'));

    const caseDtemp = text.split('<quad posn="-17 -24 0" sizen="15 15" halign="center" valign="center" addplayerid="1" manialink="ClickLadder?zoneindextop=0&amp;code=');
    const code4 = caseDtemp[1].slice(0, caseDtemp[1].indexOf('"'));

    const caseEtemp = text.split('<quad posn="0 -24 0" sizen="15 15" halign="center" valign="center" addplayerid="1" manialink="ClickLadder?zoneindextop=0&amp;code=');
    const code5 = caseEtemp[1].slice(0, caseEtemp[1].indexOf('"'));

    const caseFtemp = text.split('<quad posn="17 -24 0" sizen="15 15" halign="center" valign="center" addplayerid="1" manialink="ClickLadder?zoneindextop=0&amp;code=');
    const code6 = caseFtemp[1].slice(0, caseFtemp[1].indexOf('"'));

    const caseGtemp = text.split('<quad posn="-17 -41 0" sizen="15 15" halign="center" valign="center" addplayerid="1" manialink="ClickLadder?zoneindextop=0&amp;code=');
    const code7 = caseGtemp[1].slice(0, caseGtemp[1].indexOf('"'));

    const caseHtemp = text.split('<quad posn="0 -41 0" sizen="15 15" halign="center" valign="center" addplayerid="1" manialink="ClickLadder?zoneindextop=0&amp;code=');
    const code8 = caseHtemp[1].slice(0, caseHtemp[1].indexOf('"'));

    const caseItemp = text.split('<quad posn="17 -41 0" sizen="15 15" halign="center" valign="center" addplayerid="1" manialink="ClickLadder?zoneindextop=0&amp;code=');
    const code9 = caseItemp[1].slice(0, caseItemp[1].indexOf('"'));

    return [code1, code2, code3, code4, code5, code6, code7, code8, code9];
}
function getTotal(text) {
    try {

        const start = `valign="center" style="TextStaticSmall" text="${trackmania.nickname}"/>`;
        const temp = text.split(start)[1];

        const start2 = 'halign="center" valign="center" style="TextStaticSmall" text="$o$0cf';
        const temp2 = temp.split(start2)[1];

        return intfr(temp2.slice(0, temp2.indexOf('"')));

    } catch (e) {

        return -1;
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function intfr(num) {
    return new Intl.NumberFormat('fr-FR').format(Number(num));
}
function updateLine(line, text, foreground) {
    let t = `${text}`;
    if(t.length > lengthInfo) {
        t = t.slice(0, lengthInfo);
    } else {
        if(t.length < 24) {
            while(t.length < 24) {
                t = `${t} `;
            }
        }
    }
    readline.cursorTo(process.stdout, indexInfo, line);
    process.stdout.write(`${foreground}${t}${color.reset}`);
}
function since() {
    const now = new Date();
    let diff = now - started;
    const h = Math.floor(diff / 3_600_000);
    diff %= 3_600_000;
    const m = Math.floor(diff / 60_000);
    diff %= 60_000;
    const s = Math.floor(diff / 1_000);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function display(status) {

    updateLine(3, datenow(), color.gray);
    updateLine(4, totalClick, color.yellow);
    updateLine(6, since(), color.white);
    updateLine(7, intfr(totalSession), color.green);
    updateLine(9, intfr(totalPause), color.red);

    switch(status) {
        case 'running': updateLine(10, 'running', color.green); break;
        case 'PAUSED': updateLine(10, 'PAUSED', color.red); break;
        default: updateLine(10, 'error', color.red); break;
    }

    const r = ratio();

    updateLine(12, intfr(r[0]), color.cyan);
    updateLine(13, intfr(r[1]), color.cyan);
    updateLine(14, intfr(r[2]), color.cyan);
    updateLine(15, intfr(r[3]), color.cyan);


}
function ratio() {
    const now = new Date();
    const diff = now - started;

    const cs = Math.round((totalSession * 1_000 / diff) * 100) / 100;
    const cm = Math.round((totalSession * 60_000 / diff) * 100) / 100;
    const ch = Math.round((totalSession * 3_600_000 / diff) * 100) / 100;
    const cd = Math.round((totalSession * 86_400_000 / diff) * 100) / 100

    return [cs, cm, ch, cd];
}

// first run
run(link);
