'use client'

import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { headerData } from '@/constant'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const SideBar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay mờ nền */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 z-50 w-80 max-w-full bg-darkColor text-white h-full shadow-lg flex flex-col p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-white">Nike</div>
          <button onClick={onClose}>
            <X className="text-white hover:text-red-500" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-4 font-medium text-base">
          {headerData?.map((item) => (
            <Link
              key={item?.title}
              href={item?.href}
              onClick={onClose}
              className={`transition-colors duration-200 ${
                pathname === item.href ? 'text-white' : 'text-white/70'
              } hover:text-white`}
            >
              {item?.title}
            </Link>
          ))}
        </nav>

        {/* Social media */}
        <div className="mt-auto pt-6">
        </div>
      </motion.div>
    </>
  )
}

export default SideBar
