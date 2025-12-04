import { getCoinsTopVolume24h, setApiKey } from "@zoralabs/coins-sdk"

// Set API key if available
const ZORA_API_KEY = process.env.VITE_ZORA_API_KEY
if (ZORA_API_KEY) {
  setApiKey(ZORA_API_KEY)
  console.log("✓ Using API key")
} else {
  console.log("⚠ No API key set")
}

async function inspectSDK() {
  console.log("\n🔍 Fetching coins from Zora SDK...\n")

  try {
    const response = await getCoinsTopVolume24h({ count: 5 })

    console.log("📦 Full Response Structure:")
    console.log(JSON.stringify(response, null, 2))

    if (response?.data?.exploreList?.edges) {
      console.log("\n\n🪙 Individual Coins:\n")

      response.data.exploreList.edges.forEach((edge, index) => {
        const coin = edge.node
        console.log(`\n--- Coin ${index + 1}: ${coin.name} ---`)
        console.log(`Address: ${coin.address}`)
        console.log(`Symbol: ${coin.symbol}`)

        console.log("\n📷 Image Data:")
        console.log("mediaContent:", JSON.stringify(coin.mediaContent, null, 2))
        console.log("\ncreatorProfile.avatar:", JSON.stringify(coin.creatorProfile?.avatar, null, 2))

        // Try to extract image URL
        let imageUrl = null
        if (coin.mediaContent?.previewImage) {
          const previewImage = coin.mediaContent.previewImage
          if (typeof previewImage === 'object' && previewImage !== null) {
            imageUrl = previewImage.small || previewImage.medium || previewImage.large
          } else if (typeof previewImage === 'string') {
            imageUrl = previewImage
          }
        }

        if (!imageUrl && coin.mediaContent?.originalUri) {
          imageUrl = coin.mediaContent.originalUri
        }

        console.log("\n✅ Extracted Image URL:", imageUrl)
        console.log("─".repeat(80))
      })
    } else {
      console.log("❌ No coins data in response")
    }
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

inspectSDK()
