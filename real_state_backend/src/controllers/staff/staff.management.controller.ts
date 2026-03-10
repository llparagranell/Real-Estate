// create,update,block staffs

import { prisma } from "../../config/prisma";
import { Request, Response } from "express";
import { createStaffInput, updateStaffInput } from "../../validators/staff.validator";
import { hashPassword } from "../../utils/password";

export async function createStaff(req: Request, res: Response) {
    try {
        const { firstName, lastName, age, gender, phone, email, password, role } = req.body as createStaffInput;
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        const passwordHash = await hashPassword(password);
        await prisma.staff.create({
            data: {
                firstName,
                lastName,
                age,
                gender,
                phone,
                email,
                role,
                passwordHash
            },
        });
        return res.status(201).json({ message: "Staff created successfully" });
    } catch (error) {
        console.error("Create staff error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateStaff(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { firstName, lastName, age, gender, phone, email, role, password } = req.body as updateStaffInput;
        let passwordHash: string | undefined;
        if (password) {
            passwordHash = await hashPassword(password);
        }
        await prisma.staff.update({
            where: { id: id as string },
            data: { firstName, lastName, age, gender, phone, email, role, ...(passwordHash ? { passwordHash } : {}) },
        });
        return res.status(200).json({ message: "Staff updated successfully" });
    } catch (error) {
        console.error("Update staff error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export async function getStaffById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const staff = await prisma.staff.findUnique({
            where: { id: id as string },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                age: true,
                gender: true,
                phone: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }
        return res.status(200).json({ staff });
    } catch (error) {
        console.error("Get staff by id error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export async function blockStaff(req: Request, res: Response) {
    try{
        const {id} = req.params;
        await prisma.staff.update({
            where: { id: id as string },
            data: { isActive: false },
        });
        return res.status(200).json({ message: "Staff blocked successfully" });
    } catch (error) {
        console.error("Block staff error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export async function unblockStaff(req: Request, res: Response) {
    try{
        const {id} = req.params;
        await prisma.staff.update({
            where: { id: id as string },
            data: { isActive: true },
        });
        return res.status(200).json({ message: "Staff unblocked successfully" });
    } catch (error) {
        console.error("Unblock staff error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export async function deleteStaff(req: Request, res: Response) {
    try{
        const {id} = req.params;
        await prisma.staff.delete({
            where: { id: id as string },
        });
        return res.status(200).json({ message: "Staff deleted successfully" });
    } catch (error) {
        console.error("Delete staff error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export async function getAllStaffs(req: Request, res: Response) {
    try{
        const staffs = await prisma.staff.findMany();
        return res.status(200).json({ staffs });
    } catch (error) {
        console.error("Get all staffs error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
