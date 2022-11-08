const sortNumber = (max, min) => {
  const min_value = min || 1;
  const number = Math.floor(Math.random() * max + min_value);
  return number;
};

const sortModification = (probability) => {
  const number = Math.floor(Math.random() * 100 + 1);
  if (number <= probability) {
    return true;
  } else {
    return false;
  }
};

const initMatriz = (num_lines, num_columns) => {
  let matriz = [];

  for (let line = 0; line < num_lines; line++) {
    matriz[line] = [];
    for (let col = 0; col < num_columns; col++) {
      switch (col) {
        case 0:
          matriz[line]["N"] = line;
          break;
        case 1:
          matriz[line]["I"] = line + 1;
          break;
        case 2:
          matriz[line]["D"] = sortNumber(50);
          break;
        case 3:
          matriz[line]["R"] = 0;
          break;

        default:
          matriz[line]["M"] = 0;
          break;
      }
    }
  }

  return matriz;
};

const replyByNru = (page) => {
  const classPage = matriz_moldura.sort((a, b) => {
    const classA = () => {
      const R = a["R"];
      const M = a["M"];

      if (R === 0 && M === 0) return 1;
      if (R === 0 && M === 1) return 2;
      if (R === 1 && M === 0) return 3;
      if (R === 1 && M === 1) return 4;
    };
    const classB = () => {
      const R = b["R"];
      const M = b["M"];

      if (R === 0 && M === 0) return 1;
      if (R === 0 && M === 1) return 2;
      if (R === 1 && M === 0) return 3;
      if (R === 1 && M === 1) return 4;
    };

    return classA() - classB()
  });

  const index = matriz_moldura?.findIndex((item) => item === classPage)

  if (index !== -1) {
    matriz_moldura[index] = page;
  }
};

const replyByClock = (page) => {
  if (current_page === matriz_moldura.length) {
    current_page = 0;
  }

  if (matriz_moldura[current_page]["R"] === 0) {
    matriz_moldura[current_page] = page;
    current_page++;
  } else {
    matriz_moldura[current_page]["R"] = 0;
    current_page++;
    return replyByClock(page);
  }
};

let current_page = 0;
let matriz_moldura = initMatriz(10, 5);
const matriz_virtual = initMatriz(100, 5);

console.table(matriz_moldura);
// console.table(matriz_virtual);

for (let pos = 0; pos < 500; pos++) {
  for (let index = 0; index < 10; index++) {
    const number = sortNumber(99, 0);

    const virtual_line = matriz_virtual[number];

    matriz_moldura[index] = virtual_line;
  }

  const number = sortNumber(100);

  const moldura = matriz_moldura.find((line) => line["I"] === number);

  if (!!moldura) {
    const find_index = matriz_moldura?.findIndex(
      (line) => line["I"] === number
    );
    const index = moldura["N"];
    matriz_virtual[index]["R"] = 1;
    matriz_moldura[find_index]["R"] = 1;
    if (sortModification()) {
      matriz_virtual[index]["M"] = 1;
      matriz_virtual[index]["D"] += 1;
      matriz_moldura[find_index]["M"] = 1;
      matriz_moldura[find_index]["D"] += 1;
    }
  } else {
    // replyByNru(moldura);
    replyByClock(moldura);
  }
}

console.table(matriz_moldura);
// console.table(matriz_virtual);
