const buffer = []

let semaphore_full = {
  value: 0
}

let semaphore_empty = {
  value: 3
}

let semaphore_mutex = {
  value: 1
}

let current_process = null

const processes = [
  {
    name:"P1",
    type:"read",
    status: {
      value: "W",
      by: null,
      semaphore: null
    },
    state:"P"
  },
  {
    name:"P2",
    type:"write",
    status: {
      value: "W",
      by: null,
      semaphore: null
    },
    state:"P",
    num_insert: 0,
    index_insert:0
}
]


const init = (type) => {
  const process = processes.find((proc) => proc.type === type)
  
  if(!process){
    return init(type === "write" ? "read" : "write" )
  }

  console.table(process)
  console.table([semaphore_full, semaphore_empty, semaphore_mutex])
  console.log("Buffer -->", buffer)

  process.state = "E"


  const isWriteProcess = process.type === "write"

  
  if(isWriteProcess) {
    writeProcess(process)
  }
  else {
    readProcess(process)
  }
  process.state = "P"
  init(type)
}

const writeProcess = (process) => {
  if(!down(semaphore_empty, process)) return init("read" )
  if(!down(semaphore_mutex, process)) return init("read")
  if(insertBuffer(process.num_insert, 2, process.index_insert + 1)){
    process.num_insert = process.num_insert + 1;
    process.index_insert = process.index_insert + 1;
    if(!up(semaphore_mutex)) return init("read")
    if(!up(semaphore_full)) return init("read")
  } else{
    process.num_insert = 0;
    return init("read")
  }
}

const readProcess = (process) => {
  if(!down(semaphore_full, process)) return init("write")
  if(!down(semaphore_mutex, process)) return init("write")
  if(removeBuffer()){
    if(!up(semaphore_mutex)) return init("write")
    if(!up(semaphore_empty)) return init("write")
  }
  return init("write")
}

const insertBuffer = (number_operations, limit, index) => {
  if(number_operations === limit) {
    return false
  }
  buffer.push(`D${index}`)
  return true
}

const removeBuffer = () => {
  if(buffer.length === 0) {
    return false
  }
  buffer.pop()
  return true
}

const up = (semaphore) => {
  const value = semaphore.value;
  if(value === 0){
    semaphore.value = value + 1;
    const process = processes.filter((proc) => proc.status.value === "S" && proc.status.by === "down");
    if(process.length !== 0) {
      process[0].status.value = "W"
      return false
    }
    return false
  }
  semaphore.value = value + 1;
  return true
}

const down = (semaphore, process) => {
  const value = semaphore.value
  if(value > 0){
    semaphore.value = value -1;
    return true
  } 
  process.status = {
    value: "S",
    by: "down",
    semaphore,
  }
  return false
}

init("write")
