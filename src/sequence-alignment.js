 // DATA

 var gap = -5;
 var gc = "-";

 var S = {
     A: {
         A: 10,
         G: -1,
         C: -3,
         T: -4
     },
     G: {
         A: -1,
         G: 7,
         C: -5,
         T: -3
     },
     C: {
         A: -3,
         G: -5,
         C: 9,
         T: 0
     },
     T: {
         A: -4,
         G: -3,
         C: 0,
         T: 8
     }
 };

export function calc(i, j, arr, s1, s2) {
    let max = 0;
    let d = 0;
    let t = 0;
    let l = 0;
    let diagonal = 0;
    let top = 0;
    let left = 0;
    let parcial = 0;

    if (i <= 0) {

        left = arr[0][j-1];

        d = undefined;
        t = undefined;
        l =  + gap;

        max = l;
    } else if (j <= 0) {
    
        top = arr[0][j];

        d = undefined;
        t = top + gap;
        l = undefined;

        max = t;

    } else {

        diagonal = arr[i-1][j-1];
        top = arr[i-1][j];
        left = arr[i][j-1];

        d = diagonal + S[s2[i- 1]][s1[j - 1]];
        t = top + gap;
        l = left + gap;

        max = Math.max(t, l, d);
    }

    if (max === t) {
        parcial = top;
    } else if (max === l) {
        parcial = left; 
    } else {
        parcial = diagonal;
    }

    return {
        max,
        parcial,
        t,
        l,
        d,
        diagonal,
        left,
        top
    };
}

export default function main(s1, s2) {

    var arr = [];

    // GENERATE VOID GRID

    for(let i = 0; i <= s2.length; i++) {
        arr[i] = [];

        for(let j = 0; j <= s1.length; j++) {
            arr[i][j] = null;
        }
    }

    arr[0][0] = 0;

    // COMPLETE FIRST COLUMN AND FIRST ROW WITH GAP

    for(let i = 1; i <=s2.length; i++) {
        arr[i][0] = i * gap;
    }


    for(let j = 1; j <= s1.length; j++) {
        arr[0][j] = j * gap;
    }

    // COMPLETE GRID

    for(let i = 1; i <= s2.length; i++) {
        for(let j = 1; j<= s1.length; j++) {
            arr[i][j] = Math.max(
                arr[i-1][j-1] + S[s2[i- 1]][s1[j - 1]],
                arr[i-1][j] + gap,
                arr[i][j-1] + gap
            );
        }
    }


    let i = s2.length;
    let j = s1.length;

    const sq1 = [];
    const sq2 = [];
    const maximos = {};

    maximos[arr[s2.length][s1.length]] = [i, j];

    while(i >= 0 && j >= 0) {

        if (i === 0 && j === 0) {
            break;
        }
    
        const {
            max, t, l, d, parcial
        } = calc(i, j, arr, s1, s2);

    
        switch(max) {
            case t: 
                i--;
                sq1.push(gc);
                sq2.push(s2[i]);
                break;
            case l:
                j--;
                sq1.push(s1[j]);
                sq2.push(gc);
                break;
            case d:
                j--;
                i--;
                sq1.push(s1[j]);
                sq2.push(s2[i]);
                break;
            default:
                break;
        }

        maximos[parcial] = [i, j];
    }

    return {
        sequence: [[...sq1.reverse()],[...sq2.reverse()]],
        arr,
        score: arr[s2.length][s1.length],
        maximos
    }
}