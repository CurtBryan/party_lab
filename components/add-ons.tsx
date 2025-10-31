// "use client";

// import { Card } from "@/components/ui/card";
// import { Music, Mic, Sparkles, Camera, Clock, Users } from "lucide-react";

// interface AddOnItem {
//   name: string;
//   description: string;
//   price: string;
//   icon: React.ReactNode;
// }

// export function AddOns() {
//   const addOns: AddOnItem[] = [
//     {
//       name: "Extra Time",
//       description: "Add an additional hour to your rental",
//       price: "$75/hr",
//       icon: <Clock className="w-8 h-8 text-primary" />,
//     },
//     {
//       name: "Glow Up Kit",
//       description: "LED accessories pack for 20 guests",
//       price: "$30",
//       icon: <Sparkles className="w-8 h-8 text-primary" />,
//     },
//     {
//       name: "Wireless Microphone",
//       description: "Professional wireless mic system",
//       price: "$25",
//       icon: <Mic className="w-8 h-8 text-primary" />,
//     },
//     {
//       name: "Premium Sound",
//       description: "Upgraded sound system with subwoofer",
//       price: "$50",
//       icon: <Music className="w-8 h-8 text-primary" />,
//     },
//     {
//       name: "Photo Booth",
//       description: "Digital photo booth with props",
//       price: "$150",
//       icon: <Camera className="w-8 h-8 text-primary" />,
//     },
//     {
//       name: "Extra Capacity",
//       description: "Increase capacity to 30+ guests",
//       price: "$50",
//       icon: <Users className="w-8 h-8 text-primary" />,
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {addOns.map((addOn, index) => (
//         <Card
//           key={index}
//           className="p-6 bg-card border-2 border-border hover:border-primary transition-all hover:scale-105"
//         >
//           <div className="flex items-start gap-4">
//             <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
//               {addOn.icon}
//             </div>
//             <div className="flex-1">
//               <h4 className="text-lg font-bold text-foreground mb-1">
//                 {addOn.name}
//               </h4>
//               <p className="text-sm text-muted-foreground mb-2">
//                 {addOn.description}
//               </p>
//               <p className="text-xl font-bold text-primary">{addOn.price}</p>
//             </div>
//           </div>
//         </Card>
//       ))}
//     </div>
//   );
// }
