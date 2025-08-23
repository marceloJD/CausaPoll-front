export default function traducirId(id) {
  return id
    .split('.')                // ["0", "1", "2"]
    .map(num => Number(num) + 1) // [1, 2, 3]
    .join('.');                // "1.2.3"
}

