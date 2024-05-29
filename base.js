function base(NUM, INTO1, INTO2) {
    const into1 = Number(INTO1);
    const into2 = Number(INTO2);
    let num = String(NUM);
    if (!Number.isInteger(into1) || !Number.isInteger(into2)) {
        return '';
    }
    let isNeg = false;
    if (num[0] === '-') {
        isNeg = true;
        num = num.slice(1);
    }
    if (into1 > 1 && into1 < 37 && into2 > 1 && into2 < 37) {
        let dec = 0;
        num = num.toString().split('.');
        if (num.length > 1) {
            // 处理小数部分
            let fractional = 0;
            const fractionalStr = num[1];
            for (let i = 0; i < fractionalStr.length; i++) {
                const digit = parseInt(fractionalStr[i], into1);
                fractional += digit / (into1 ** (i + 1));
            }
            dec = parseInt(num[0], into1) + fractional;
        } else {
            dec = parseInt(num[0], into1);
        }
        const result = dec.toString(into2);
        return (isNeg ? '-' : '') + result.toUpperCase();
    } else {
        return '';
    }
}

module.exports = { base };
