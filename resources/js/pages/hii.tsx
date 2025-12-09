// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { CheckCircle } from "lucide-react";
// import Image from "next/image";

// const chartData = [
//   { name: "Jan", total: 46 },
//   { name: "Feb", total: 39 },
//   { name: "Mar", total: 46 },
//   { name: "Apr", total: 47 },
//   { name: "Mei", total: 49 },
//   { name: "Jun", total: 46 },
//   { name: "Jul", total: 46 },
//   { name: "Agu", total: 46 },
//   { name: "Sep", total: 46 },
//   { name: "Okt", total: 46 },
//   { name: "Nov", total: 53 },
//   { name: "Des", total: 54 },
// ];

// export default function hii() {
//   return (
//     <div className="w-full min-h-screen bg-white">
//       <header className="bg-[#19456b] text-white p-4 flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <Image src="/logo.png" alt="Logo" width={40} height={40} />
//           <nav className="flex gap-6">
//             <a href="#" className="hover:underline">Tentang</a>
//             <a href="#" className="hover:underline">Laporan</a>
//             <a href="#" className="hover:underline">Kontak</a>
//           </nav>
//         </div>
//         <Button className="bg-blue-500 text-white">Login</Button>
//       </header>

//       <section className="bg-[#19456b] text-white py-12 px-8 flex flex-col md:flex-row items-center justify-between">
//         <div className="max-w-xl">
//           <h1 className="text-4xl font-bold mb-4">Sistem Keuangan Iuran PGRI</h1>
//           <p className="text-lg mb-6">Transparansi dan Akuntabilitas Keuangan PGRI Seluruh Indonesia</p>
//           <Button className="bg-blue-600 text-white">Lihat Rekap Laporan</Button>
//         </div>
//         <Image src="/img1.jpg" alt="Hero Image" width={300} height={300} className="rounded-xl mt-6 md:mt-0" />
//       </section>

//       <section className="p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Tentang PGRI</h2>
//           <p className="text-gray-700 mb-6">
//             Didedardada 19.45. PGRI adalah organisasi profesional yang memiugqur gurur dan tinggi mempercayortasakan dan kualitas pendidikan Indonesia.
//           </p>
//           <h3 className="text-xl font-semibold mb-2">Fitur Sistem</h3>
//           <ul className="space-y-2">
//             <li className="flex items-center gap-2 text-green-600">
//               <CheckCircle className="w-5 h-5" /> Pengeolaan laporan keuangan
//             </li>
//             <li className="flex items-center gap-2 text-green-600">
//               <CheckCircle className="w-5 h-5" /> Laporan tiap kabupaten
//             </li>
//             <li className="flex items-center gap-2 text-green-600">
//               <CheckCircle className="w-5 h-5" /> Akaes cepat dan transparan
//             </li>
//             <li className="flex items-center gap-2 text-green-600">
//               <CheckCircle className="w-5 h-5" /> Rekap iuran per bulan dan tahun
//             </li>
//           </ul>
//         </div>
//         <Image src="/img2.jpg" alt="Tentang Image" width={400} height={400} className="rounded-xl" />
//       </section>

//       <section className="p-8">
//         <h2 className="text-2xl font-bold mb-6">Rekap Laporan Keuangan (Januari - Desember)</h2>
//         <Card className="overflow-x-auto">
//           <CardContent>
//             <table className="w-full table-auto text-sm text-left border">
//               <thead className="bg-gray-200">
//                 <tr>
//                   <th className="p-2">Kabupaten</th>
//                   {chartData.map((d) => (
//                     <th key={d.name} className="p-2">{d.name}</th>
//                   ))}
//                   <th className="p-2">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="border-t">
//                   <td className="p-2">Kabupaten A</td>
//                   <td className="p-2">570</td><td className="p-2">350</td><td className="p-2">350</td><td className="p-2">300</td><td className="p-2">370</td><td className="p-2">350</td><td className="p-2">550</td><td className="p-2">550</td><td className="p-2">550</td><td className="p-2">550</td><td className="p-2">570</td><td className="p-2">570</td>
//                   <td className="p-2 font-semibold">5,280</td>
//                 </tr>
//                 <tr className="border-t">
//                   <td className="p-2">Kabupaten B</td>
//                   <td className="p-2">370</td><td className="p-2">380</td><td className="p-2">480</td><td className="p-2">380</td><td className="p-2">580</td><td className="p-2">480</td><td className="p-2">500</td><td className="p-2">480</td><td className="p-2">480</td><td className="p-2">490</td><td className="p-2">470</td><td className="p-2">510</td>
//                   <td className="p-2 font-semibold">5,580</td>
//                 </tr>
//                 <tr className="border-t">
//                   <td className="p-2">Kabupaten C</td>
//                   <td className="p-2">360</td><td className="p-2">580</td><td className="p-2">400</td><td className="p-2">450</td><td className="p-2">460</td><td className="p-2">430</td><td className="p-2">460</td><td className="p-2">470</td><td className="p-2">470</td><td className="p-2">470</td><td className="p-2">480</td><td className="p-2">530</td>
//                   <td className="p-2 font-semibold">5,540</td>
//                 </tr>
//                 <tr className="border-t">
//                   <td className="p-2">Kabupaten D</td>
//                   <td className="p-2">420</td><td className="p-2">550</td><td className="p-2">400</td><td className="p-2">460</td><td className="p-2">460</td><td className="p-2">430</td><td className="p-2">300</td><td className="p-2">300</td><td className="p-2">350</td><td className="p-2">350</td><td className="p-2">300</td><td className="p-2">300</td>
//                   <td className="p-2 font-semibold">4,620</td>
//                 </tr>
//               </tbody>
//             </table>
//           </CardContent>
//         </Card>
//         <div className="mt-6 h-72">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="total" fill="#1E90FF" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </section>

//       <footer className="bg-[#19456b] text-white p-4 text-center">
//         <div>Jl. Guru No. 1, Jakarta | +62:21 1234567 | info@pgri.or.id</div>
//         <div className="mt-2 flex justify-center gap-4">
//           <a href="#"><i className="fab fa-facebook"></i></a>
//           <a href="#"><i className="fab fa-twitter"></i></a>
//           <a href="#"><i className="fab fa-instagram"></i></a>
//         </div>
//       </footer>
//     </div>
//   );
// }
