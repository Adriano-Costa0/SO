const quantum = 1000;

const process = {
  [0]: {
    tp: 0,
    pid: 10000,
    cp: 1,
    ep: "PRONTO",
    num_es: 0,
    num_cpu: 0,
  },
  [1]: {
    tp: 0,
    pid: 5000,
    cp: 1,
    ep: "PRONTO",
    num_es: 0,
    num_cpu: 0,
  },
  [2]: {
    tp: 0,
    pid: 7000,
    cp: 1,
    ep: "PRONTO",
    num_es: 0,
    num_cpu: 0,
  },
  [3]: {
    tp: 0,
    pid: 3000,
    cp: 1,
    ep: "PRONTO",
    num_es: 0,
    num_cpu: 0,
  },
  [4]: {
    tp: 0,
    pid: 3000,
    cp: 1,
    ep: "PRONTO",
    num_es: 0,
    num_cpu: 0,
  },
  [5]: {
    tp: 0,
    pid: 8000,
    cp: 1,
    ep: "PRONTO",
    num_es: 0,
    num_cpu: 0,
  },
  [6]: {
    tp: 0,
    pid: 2000,
    cp: 1,
    ep: "PRONTO",
    num_es: 0,
    num_cpu: 0,
  },
  [7]: {
    tp: 0,
    pid: 5000,
    cp: 1,
    ep: "PRONTO",
    num_es: 0,
    num_cpu: 0,
  },
  [8]: {
    tp: 0,
    pid: 4000,
    cp: 1,
    ep: "PRONTO",
    num_es: 0,
    num_cpu: 0,
  },
  [9]: {
    tp: 0,
    pid: 10000,
    cp: 1,
    ep: "PRONTO",
    num_es: 0,
    num_cpu: 0,
  },
};

const process_table = {};

const handleEventInput = (probability) => {
  const number = Math.floor(Math.random() * 100 + 1);
  if (number <= probability) {
    return true;
  } else {
    return false;
  }
};

const executProcess = (index) => {
  const current_process = process_table[index] || process[index];

  if (!Object.keys(process).length && !Object.keys(process_table).length) {
    return;
  }

  if (!current_process) {
    return executProcess(index === 9 ? 0 : index + 1);
  }

  if (current_process.tp * quantum === current_process.pid) {
    delete process[index];
    delete process_table[index];
    console.table(current_process);
    return executProcess(index === 9 ? 0 : index + 1);
  }

  const is_bloqued = current_process.ep === "BLOQUEADO";
  const has_input_event = handleEventInput(is_bloqued ? 30 : 5);

  if (!is_bloqued) {
    process_table[index] = {
      ...current_process,
      tp: has_input_event ? current_process.tp : current_process.tp + 1,
      cp: current_process.cp + 1,
      ep: has_input_event ? "BLOQUEADO" : "PRONTO",
      num_es: has_input_event
        ? current_process.num_es + 1
        : current_process.num_es,
      num_cpu: current_process.num_cpu + 1,
    };
    console.log(`EXECUTANDO >>> ${has_input_event ? "BLOQUEADO" : "PRONTO"} `);
  } else {
    process_table[index] = {
      ...current_process,
      cp: current_process.tp + 1,
      ep: has_input_event ? "PRONTO" : "BLOQUEADO",
      num_es: has_input_event
        ? current_process.num_es + 1
        : current_process.num_es,
      num_cpu: current_process.num_cpu + 1,
    };
    console.log(`EXECUTANDO >>> ${has_input_event ? "PRONTO" : "BLOQUEADO"} `);
  }

  executProcess(index === 9 ? 0 : index + 1);
};

executProcess(0);
