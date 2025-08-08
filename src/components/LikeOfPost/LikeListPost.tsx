// import React from "react";
// import Modal from "../Modal/modal";
// import useDisableBodyScroll from "@/hook/useDisableBodyScroll";


// type User = {
//   _id: string;
//   name: string;
//   avatar: string;
// };

// type Props = {
//   postId: string,
//   isOpen: boolean;
//   onClose: () => void;
//   users: User[];
// };

// export default function LikeListModal({ isOpen, onClose, users }: Props) {
  

//   useDisableBodyScroll(isOpen);
//   if (!isOpen) return null;

//   return (
//     <Modal>
//       <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] relative flex flex-col">
//         {/* Header cố định */}
//         <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b">
//           <button
//             onClick={onClose}
//             className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
//           >
//             &times;
//           </button>
//           <h2 className="text-xl font-semibold">DANH SÁCH ĐÃ THÍCH</h2>
//         </div>

//         <div className="overflow-y-auto px-6 pb-6 space-y-4">
//           <ul className="space-y-4">
//             {users.map((user) => (
//               <li key={user._id} className="flex items-center gap-3">
//                 <img
//                   src={user.avatar || "/assets/img/user.png"}
//                   alt={user.name}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <span className="text-sm font-medium">{user.name}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </Modal>
//   );
// }
