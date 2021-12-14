let names = ["Abidin", "Binta", "Dani", "Hendro"];
let name = "hendro";
let nama1 = "abidin";
let alamat1 = "bekasi";
let nama2 = "binta";
let alamat2 = "tangerang";

console.log([
  { nama1, alamat1 },
  { nama2, alamat2 },
]);


let dataOrang1 = {
  name: "hendro",
  address: "Lampung",
  email: "mhendro@gmail.com",
};


console.log(dataOrang1.email);
console.log(dataOrang1["email"]);

let allDatas = [
  {
    name: "dani",
    address: "bogor",
  },
  dataOrang1,
];

console.log(allDatas);