import { baseApi } from '@/api/baseApi'
import { DEFAULT_SETTINGS } from '@/config/site'
import type { ApiResponse, DeliveryRegion, SiteSettings } from '@/types/site'

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<SiteSettings, void>({
      query: () => '/settings',
      transformResponse: (response: ApiResponse<SiteSettings>) => response.data,
    }),
  }),
})

// The live site settings, falling back to the defaults while loading or if the API is unreachable.
export const useSiteSettings = (): SiteSettings => settingsApi.useGetSettingsQuery().data ?? DEFAULT_SETTINGS

export const regionForDistrict = (settings: SiteSettings, district: string): DeliveryRegion =>
  settings.shipping.insideDhakaDistricts.includes(district) ? 'dhaka' : 'outside'

// Mirrors the backend's calculation; the server's figure is the one charged.
export const shippingFor = (settings: SiteSettings, subtotal: number, region: DeliveryRegion = 'dhaka') =>
  subtotal === 0 || subtotal >= settings.shipping.freeShippingThreshold ? 0 : settings.shipping[region].fee

export const deliveryRates = (settings: SiteSettings) =>
  (['dhaka', 'outside'] as const).map((region) => {
    const rate = settings.shipping[region]
    return {
      region,
      label: region === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka',
      fee: rate.fee,
      days: [rate.minDays, rate.maxDays] as const,
      eta: rate.minDays === rate.maxDays ? `${rate.minDays} day${rate.minDays === 1 ? '' : 's'}` : `${rate.minDays}-${rate.maxDays} days`,
    }
  })
