import {
    Layout,
    Newspaper,
    Tags,
    Users,
    MessageCircle,
    Bell,
    Mail,
    BarChart2,
    Eye,
    Bookmark,
} from "lucide-react";
import React from "react";

export type Role = "ADMIN" | "SUPERADMIN";

export interface NavItem {
    title: string;
    href: string;
    icon?: React.ReactNode;
    badge?: number;
}

export interface PublicNavItem {
    name: string;
    href: string;
}

export interface NavSection {
    title: string;
    items: NavItem[];
}

// === Menu Admin & Superadmin ===
export const navByRole: Record<Role, NavSection[]> = {
    ADMIN: [
        {
            title: "Dashboard",
            items: [
                {
                    title: "Dashboard",
                    href: "/sys/dashboard",
                    icon: React.createElement(Layout, { className: "h-4 w-4" }),
                },
            ],
        },
        {
            title: "Content Management",
            items: [
                {
                    title: "Posts",
                    href: "/sys/posts",
                    icon: React.createElement(Newspaper, { className: "h-4 w-4" }),
                },
                {
                    title: "Labels / Tags",
                    href: "/sys/labels",
                    icon: React.createElement(Tags, { className: "h-4 w-4" }),
                },
                {
                    title: "Comments",
                    href: "/sys/comments",
                    icon: React.createElement(MessageCircle, { className: "h-4 w-4" }),
                },
            ],
        },
        {
            title: "User Interactions",
            items: [
                {
                    title: "Likes",
                    href: "/sys/likes",
                    icon: React.createElement(Users, { className: "h-4 w-4" }),
                },
                {
                    title: "Bookmarks",
                    href: "/sys/bookmarks",
                    icon: React.createElement(Bookmark, { className: "h-4 w-4" }),
                },
                {
                    title: "Reactions",
                    href: "/sys/reactions",
                    icon: React.createElement(Bell, { className: "h-4 w-4" }),
                },
                {
                    title: "Post Views",
                    href: "/sys/views",
                    icon: React.createElement(Eye, { className: "h-4 w-4" }),
                },
            ],
        },
        {
            title: "Subscribers & Email",
            items: [
                {
                    title: "Subscribers",
                    href: "/sys/subscribers",
                    icon: React.createElement(Users, { className: "h-4 w-4" }),
                },
                {
                    title: "Newsletters",
                    href: "/sys/newsletters",
                    icon: React.createElement(Mail, { className: "h-4 w-4" }),
                },
            ],
        },
        {
            title: "Analytics",
            items: [
                {
                    title: "Search Logs",
                    href: "/sys/search-logs",
                    icon: React.createElement(BarChart2, { className: "h-4 w-4" }),
                },
            ],
        },
    ],

    SUPERADMIN: [
        {
            title: "Superadmin Panel",
            items: [
                {
                    title: "Dashboard",
                    href: "/superadmin/dashboard",
                    icon: React.createElement(Layout, { className: "h-4 w-4" }),
                },
                {
                    title: "Manage Admins",
                    href: "/superadmin/admin-users",
                    icon: React.createElement(Users, { className: "h-4 w-4" }),
                },
                {
                    title: "All Posts",
                    href: "/superadmin/posts",
                    icon: React.createElement(Newspaper, { className: "h-4 w-4" }),
                },
            ],
        },
    ],
};

export const publicNavLinks: PublicNavItem[] = [
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "News", href: "/news" },
    { name: "Games", href: "/games" },
    { name: "CS Hub", href: "/cs-hub" },
    { name: "Tech Talk Video", href: "/tech-talk-video" },
];

