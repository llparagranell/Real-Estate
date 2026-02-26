"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card"
import { FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X, Pencil, OctagonMinus, XIcon, Upload, ImageIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function EditUser() {
    return (
        <div className="p-6">
            <Card className="relative max-w-5xl">
                <button className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 cursor-pointer">
                    <X className="size-6" />
                </button>

                <CardHeader className="pb-0">
                    <CardTitle className="text-xl font-semibold">
                        Edit User Details
                    </CardTitle>
                    <CardDescription>
                        Update details of existing user.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {/* Left Column — Personal Information */}
                        <div className="space-y-5">
                            <div className="space-y-4">
                                <div className="flex justify-center items-center cursor-pointer">
                                    <div className="h-28 w-28 rounded-full border-2 flex items-center justify-center">
                                        <ImageIcon className="size-5 text-zinc-500" />
                                    </div>
                                </div>
                                <div className="flex font-medium text-zinc-500 justify-center items-center gap-2">
                                    <Upload className="size-5" />
                                    <p> Upload Image</p>
                                    <p> (max 512 KB) </p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center space-x-2">
                                <Label htmlFor="airplane-mode" className="font-medium text-sm">Verified Seller <span className="text-[12px] text-zinc-500">(Provide Verified Badge )</span></Label>
                                <Switch id="airplane-mode" />
                            </div>

                            <h3 className="text-base font-semibold">KYC Details</h3>
                            <div className="space-y-1.5">
                                <FieldLabel className="font-medium">Aadhaar Number</FieldLabel>
                                <Input type="text" placeholder="eg. 1234 5678 9012" className="h-10 border-2 bg-white" />
                            </div>
                            <div className="space-y-1.5">
                                <FieldLabel>PAN Number</FieldLabel>
                                <Input type="text" placeholder="eg. ABCDE1234F" className="h-10 border-2 bg-white" />
                            </div>
                        </div>
                        <div className="space-y-5">
                            <h3 className="text-base font-semibold">Personal Information</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <FieldLabel>First Name</FieldLabel>
                                    <Input placeholder="eg. John" className="h-10 border-2 bg-white" />
                                </div>
                                <div className="space-y-1.5">
                                    <FieldLabel>Last Name</FieldLabel>
                                    <Input placeholder="eg. Doe" className="h-10 border-2 bg-white" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <FieldLabel>Enter Age</FieldLabel>
                                    <Input type="number" placeholder="eg. 28" className="h-10 border-2 bg-white" />
                                </div>
                                <div className="space-y-1.5">
                                    <FieldLabel>Select Gender</FieldLabel>
                                    <Select>
                                        <SelectTrigger className="h-10 border-2 shadow-none bg-white">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="transgender">Transgender</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <FieldLabel>Enter mobile number</FieldLabel>
                                <Input type="tel" placeholder="eg. 87988 88797" className="h-10 border-2 bg-white" />
                            </div>

                            <div className="space-y-1.5">
                                <FieldLabel>Enter email</FieldLabel>
                                <Input type="email" placeholder="eg. testemail123@gmail.com" className="h-10 border-2 bg-white" />
                            </div>
                            <div className="space-y-1.5">
                                <FieldLabel>Enter Sponsor code</FieldLabel>
                                <Input type="text" placeholder="eg. DHJS6755GHGHGHK" className="h-10 border-2 bg-white" />
                            </div>
                        </div>

                        {/* Right Column — Password + Role */}

                    </div>
                </CardContent>

                <CardFooter className="justify-end gap-3 px-6 mb-3">
                    <Button variant="outline" className="gap-2 border-red-200 hover:bg-red-50 hover:text-red-600 shadow-none">
                        <OctagonMinus className="size-4 text-orange-500" />
                        Block User
                    </Button>
                    <Button variant="outline" className="gap-2 border-red-200 hover:bg-red-50 hover:text-red-600 shadow-none">
                        <XIcon className="size-5 text-red-500" />
                        Cancel
                    </Button>
                    <Button className="gap-2 bg-blue-500 hover:bg-blue-700 text-white">
                        <Pencil className="size-4" />
                        Update Changes
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
