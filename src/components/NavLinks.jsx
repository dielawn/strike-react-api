import './NavLinks.css'
import { useState } from "react";
import HomeIcon from "../assets/home_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png";
import SendIcon from "../assets/arrow_outward_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png";
import RecieveIcon from "../assets/south_west_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png"
import ExchangeIcon from "../assets/currency_exchange_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png"
import HistoryIcon from "../assets/schedule_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png"

const links = [
  { 
    name: 'Home', 
    tab: 'dashboard', 
    icon: HomeIcon 
  },
  {
    name: 'Recieve',
    tab: 'getPaid',
    icon: RecieveIcon,
  },
  { 
    name: 'Send', 
    tab: 'payOut', 
    icon: SendIcon 
  },
  {
    name: 'Exchange',
    tab: 'exchangeCurrency',
    icon: ExchangeIcon
  },
  {
    name: 'History',
    tab: 'history',
    icon: HistoryIcon
  }
];

export default function NavLinks({ activeTab, handleTabChange}) {
   

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
            <button
            key={link.name}
            onClick={() => handleTabChange(link.tab)}
            className={`nav-link ${activeTab === link.tab ? 'nav-link-active' : ''} md:nav-link-md`}
          >
            <img src={LinkIcon} alt={link.name} className="nav-icon" />
            {link.name}
          </button>
        );
      })}
    </>
  );
}
