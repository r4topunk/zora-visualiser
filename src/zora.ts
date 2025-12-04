import { getCoinsTopVolume24h, setApiKey, type ExploreResponse } from "@zoralabs/coins-sdk"

// Get API key from environment (optional but recommended)
const ZORA_API_KEY = (import.meta as any).env?.VITE_ZORA_API_KEY
if (ZORA_API_KEY) {
  setApiKey(ZORA_API_KEY)
}

// Extract the coin type from the explore response
type CoinNode = NonNullable<NonNullable<ExploreResponse["data"]>["exploreList"]>["edges"][number]["node"]

export async function get30CoinImages() {
  try {
    console.log("Fetching top volume coins from Zora SDK...")

    // Use the SDK method directly - fetch 100 coins
    const response = await getCoinsTopVolume24h({ count: 100 })

    if (response?.data?.exploreList?.edges && response.data.exploreList.edges.length > 0) {
      const coins = response.data.exploreList.edges.map(edge => edge.node)
      console.log(`✓ Fetched ${coins.length} coins from Zora SDK (top volume 24h)`)
      console.log("Sample coin:", coins[0])

      return coins.map((coin) => extractImageUrl(coin))
    }

    console.warn("No coins data received from Zora SDK")
    return getFallbackImages()
  } catch (error) {
    console.error("Error fetching Zora coins:", error)
    console.log("Falling back to local images")
    return getFallbackImages()
  }
}

// Public IPFS gateways that support CORS
const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/'
]

function ipfsToHttp(ipfsUri: string): string {
  if (!ipfsUri.startsWith('ipfs://')) return ipfsUri

  // Extract the CID from ipfs://CID
  const cid = ipfsUri.replace('ipfs://', '')

  // Use the first gateway (can rotate if needed)
  return `${IPFS_GATEWAYS[0]}${cid}`
}

function extractImageUrl(coin: CoinNode): string {
  let imageUrl: string | undefined

  // Priority 1: Use IPFS original URI (better CORS support)
  if (coin.mediaContent?.originalUri) {
    imageUrl = ipfsToHttp(coin.mediaContent.originalUri)
    console.log(`Using IPFS URL for ${coin.name}:`, imageUrl)
    return imageUrl
  }

  // Priority 2: Try mediaContent.previewImage from CDN
  if (coin.mediaContent?.previewImage) {
    const previewImage = coin.mediaContent.previewImage
    if (typeof previewImage === 'object' && previewImage !== null) {
      imageUrl = previewImage.small || previewImage.medium
    } else if (typeof previewImage === 'string') {
      imageUrl = previewImage
    }
  }

  // Priority 3: Check creator profile avatar as fallback
  if (!imageUrl && coin.creatorProfile?.avatar?.previewImage) {
    const avatarImage = coin.creatorProfile.avatar.previewImage
    if (typeof avatarImage === 'object' && avatarImage !== null) {
      imageUrl = avatarImage.medium || avatarImage.small
    }
  }

  // Last resort fallback
  if (!imageUrl) {
    imageUrl = `/covers/image_0.jpg`
  }

  return imageUrl
}

function getFallbackImages(): string[] {
  return new Array(30)
    .fill(0)
    .map((_, i) => `/covers/image_${i}.jpg`)
}
