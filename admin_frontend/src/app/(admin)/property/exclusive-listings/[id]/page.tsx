"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api"

/**
 * Redirects /property/exclusive-listings/:exclusiveId to /property/:sourcePropertyId
 * so all property details use the unified /property/:id route.
 */
export default function ExclusiveListingRedirectPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const exclusivePropertyId = Array.isArray(params?.id) ? params.id[0] : params?.id

    useEffect(() => {
        if (!exclusivePropertyId) return

        let isMounted = true

        const redirect = async () => {
            try {
                const { data } = await api.get<{
                    success: boolean
                    data: { sourceProperty: { id: string } }
                }>(`/staff/properties/exclusive/${exclusivePropertyId}`)
                if (!isMounted || !data?.data?.sourceProperty?.id) return
                router.replace(`/property/${data.data.sourceProperty.id}`)
            } catch {
                if (isMounted) router.replace("/property/exclusive-listings")
            }
        }

        redirect()
        return () => {
            isMounted = false
        }
    }, [exclusivePropertyId, router])

    return (
        <div className="p-4">
            <p className="text-sm text-gray-500">Redirecting to property...</p>
        </div>
    )
}
