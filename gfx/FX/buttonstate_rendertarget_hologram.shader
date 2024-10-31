Includes = {
	"buttonstate.fxh"
}

PixelShader =
{
	Samplers =
	{
		MapTexture =
		{
			Index = 0
			MagFilter = "linear"
			MinFilter = "linear"
			MipFilter = "None"
			AddressU = "Clamp"
			AddressV = "Clamp"
		}

		MaskingTexture =
		{
			Index = 5
			MagFilter = "Point"
			MinFilter = "Point"
			MipFilter = "None"
			AddressU = "Clamp"
			AddressV = "Clamp"
		}		
	}
}


VertexStruct VS_OUTPUT
{
	float4  vPosition : PDX_POSITION;
	float2  vScreenPos : TEXCOORD3;
	float2  vTexCoord : TEXCOORD0;
@ifdef MASKING
	float2  vMaskingTexCoord : TEXCOORD2;
@endif	
};


VertexShader =
{
	MainCode VertexShader
		ConstantBuffers = { Common }
	[[
		VS_OUTPUT main(const VS_INPUT v )
		{
			VS_OUTPUT Out;
			Out.vPosition  = mul( WorldViewProjectionMatrix, float4( v.vPosition.xyz, 1 ) );
			Out.vScreenPos = Out.vPosition.xy;
		
			Out.vTexCoord = v.vTexCoord;
			Out.vTexCoord += Offset;

		#ifdef MASKING
			//A bit hacky, but we want the masking texture coordinates to be in the range [0,1]. We turn all 0's to 0 and all nonzero to 1.
			Out.vMaskingTexCoord = saturate(v.vTexCoord * 1000);
		#endif

#ifdef PDX_OPENGL
			//Flip texture coordinates so map is not upside down
			Out.vTexCoord.y = 1 - Out.vTexCoord.y;
#endif		
		
			return Out;
		}
	]]
}

PixelShader =
{
	MainCode PixelShader
		ConstantBuffers = { Common }
	[[
		float4 main( VS_OUTPUT v ) : PDX_COLOR
		{
			const float vFadeoutHeight = 5;
			const float vFadeoutPosition = 0.95;
			const float vMinimumStatic = 0.03;
			float vAmountStatic = saturate(v.vTexCoord.y - vFadeoutPosition) * vFadeoutHeight + vMinimumStatic;

			const float vNumberOfScanlines = 4;
			const float vScanlineSpeed = 0.2;
			const float vScanlineExposure = 0.75;
			float vGradientScanline = 1 - mod(((v.vTexCoord.y) * vNumberOfScanlines + Time * vScanlineSpeed), 1);
			float vWavyScanline = saturate(vGradientScanline * (1 - vGradientScanline) + vScanlineExposure);

			// Sample texture, offset X by static.
			float2 texCoord = v.vTexCoord;
			texCoord.x += (vGradientScanline - 0.5) * vAmountStatic * 0.2;
			float4 TextureColor = tex2D( MapTexture, texCoord );

			// The regular portrait with colours
			float4 PortraitColor = tex2D( MapTexture, v.vTexCoord );

			// Edge detection in 2 directions.
			const float vEdgeThickness = 0.008;
			const float vEdgeBoost = 2;
			const float vEdgeContrast = 1;
			float4 SampleH = tex2D( MapTexture, texCoord + float2(vEdgeThickness, 0));
			float4 SampleV = tex2D( MapTexture, texCoord + float2(0, vEdgeThickness));
			float4 SampleHDiff = abs(TextureColor - SampleH);
			float4 SampleVDiff = abs(TextureColor - SampleV);
			float4 EdgeAmount = max(SampleHDiff, SampleVDiff);
			// Use channel with strongest difference.
			float vEdgeAmount = max(EdgeAmount.r, max(EdgeAmount.g, max(EdgeAmount.b, EdgeAmount.a)));
			vEdgeAmount = pow(vEdgeAmount * vEdgeBoost, vEdgeContrast);

			// Make Edge cyan colored.
			const float4 vEdgeColorBoost = float4(0, 0, 0, 0);
			float4 EdgesOverlay = saturate(vEdgeAmount * vEdgeColorBoost);

			// Get Luminosity of texture.
			float maxChannel = max(TextureColor.r, max(TextureColor.g, TextureColor.b));
			const float3 ShadowColor = float3(0, 0, 0);
			const float3 HighlightColor = float3(0, 0, 0);
			float4 Fill;
			Fill.rgb = lerp(ShadowColor, HighlightColor, maxChannel);
			Fill.a = TextureColor.a * maxChannel;

			float4 OutColor = PortraitColor + Fill + EdgesOverlay * 0.2;
			OutColor *= Color;

		#ifdef MASKING
			// Untested in this shader...
			float4 MaskColor = tex2D( MaskingTexture, v.vMaskingTexCoord );
			OutColor.a *= MaskColor.a;
		#endif

			return OutColor;
		}
	]]
	
}


BlendState BlendState
{
	BlendEnable = yes
	SourceBlend = "src_alpha"
	DestBlend = "inv_src_alpha"
}


Effect Up
{
	VertexShader = "VertexShader"
	PixelShader = "PixelShader"
}

Effect Down
{
	VertexShader = "VertexShader"
	PixelShader = "PixelShader"
}

Effect Disable
{
	VertexShader = "VertexShader"
	PixelShader = "PixelShader"
}

Effect Over
{
	VertexShader = "VertexShader"
	PixelShader = "PixelShader"
}

