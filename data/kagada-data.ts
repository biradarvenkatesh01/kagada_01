import { FileText, Image as ImageIcon, Cpu, Sparkles, Heart } from "lucide-react";
import { CardStackItem } from "@/components/ui/card-stack";
import { TimelineItem } from "@/components/ui/radial-orbital-timeline";

export const KAGADA_EVENT_DATE = new Date("2026-10-10T00:00:00");

// Exactly 3 Rich About Section Cards
export const ABOUT_CARDS: CardStackItem[] = [
  { id: 1, type: "uvce", title: "About UVCE" },
  { id: 2, type: "ieee", title: "About IEEE UVCE" },
  { id: 3, type: "kagada", title: "About KAGADA" },
];

// Kagada 2026 Track Orbital Nodes
export const TRACKS_TIMELINE_DATA: TimelineItem[] = [
  {
    id: 1,
    title: "Paper Presentation",
    date: "Oct 10, 2026",
    content: "Present original research papers across CSE, AI/ML, ECE, EEE, Mechanical, Civil & Architecture.",
    description:
      "Paper presentation competition gives participants a chance to present their technical research papers in their domain of interest and lay an initial stone to engrave one's knowledge to serve society with their innovative ideas including categories UG/PG. Paper presentation will be in online mode, allowing participants to showcase their work. It also provides an opportunity to receive constructive feedback from experts, enhancing their research and presentation skills.",
    imageSrc: "/paper.png",
    category: "Paper",
    icon: FileText,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 2,
    title: "Poster Presentation",
    date: "Oct 10, 2026",
    content: "Visual research posters, technical infographics, and scientific concept demonstrations.",
    description:
      "Poster presentation provides an opportunity to present innovative ideas through technical posters to depict how real-life problems can be solved. Participants are free to choose the domain of their choice and the presentation will be held in hybrid mode. This event encourages creativity, critical thinking, and clear communication of technical concepts. Additionally, participants get a chance to engage with judges and peers, receive valuable feedback, and inspire others with their innovative solutions.",
    imageSrc: "/poster.jpg",
    category: "Poster",
    icon: ImageIcon,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Project Presentation",
    date: "Oct 10, 2026",
    content: "Live working hardware prototypes, software solutions, and innovative engineering models.",
    description:
      "Project presentation makes way for students to bring out the inventors in them and their creativity to pure reality through working model demonstrations. This also helps them to display their innovative thoughts on different domains, encouraging problem-solving and critical thinking. The event also helps students gain confidence in presenting their projects, while inspiring peers and fostering a culture of learning and innovation.",
    imageSrc: "/project.jpg",
    category: "Project",
    icon: Cpu,
    relatedIds: [1, 2],
    status: "in-progress" as const,
    energy: 100,
  },
  {
    id: 4,
    title: "Ottige Kaliyona",
    date: "Special Outreach",
    content: "Flagship social initiative empowering government school students through technology education.",
    description:
      "Ottige Kaliyona, conducted by IEEE WIE during KAGADA 25, is an initiative to contribute in uprising of the society, inviting students from a government school for technical education and fun activities. The program provides hands-on learning experiences, fostering curiosity and creativity among young minds.",
    imageSrc: "/ottigekaliona.jpg",
    category: "Social",
    icon: Sparkles,
    relatedIds: [5],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 5,
    title: "Food For Cause",
    date: "Charity Drive",
    content: "Charitable food stall project where 100% of profits are donated directly to orphanages.",
    description:
      "The event is conducted by students of UVCE where food stalls serve a variety of delicious foods to visitors. The profits collected from these stalls are donated to an NGO, supporting a meaningful cause. Along with enjoying good food, attendees also get to engage with the vibrant student community, making the event both fun and impactful.",
    imageSrc: "/FoodForCause.JPG",
    category: "Charity",
    icon: Heart,
    relatedIds: [4],
    status: "completed" as const,
    energy: 88,
  },
];
