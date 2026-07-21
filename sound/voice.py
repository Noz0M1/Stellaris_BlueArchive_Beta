import os
# 代码说明：
# 直接生成ba_speak_soundeffect.asset，不需要额外入参，读取voice/下的全部wav文件，自动按规则生成
pwd = os.path.dirname(__file__)
wav_files = [f for f in os.listdir(os.path.join(pwd, 'voice')) if f.endswith('.wav')]

output = open(os.path.join(pwd, 'ba_speak_soundeffect.asset'), 'w')
output.write("# 请勿编辑该文件，请使用ba_voice.py生成文件(需要python3)\n")

# 1.生成示例：
# sound = {
# 	name = "arona_menu_talk_00"
# 	file = "voice/arona_menu_talk_00.wav"
# 	always_load = no
# }
# soundeffect = {
# 	name = "effect_arona_menu_talk_00"
# 	volume = 0.9
# 	sounds = {
# 		sound = arona_menu_talk_00
# 	}
# }
for file in wav_files:
    name = os.path.splitext(file)[0]
    str = f"""
sound = {{
	name = "{name}"
	file = "voice/{file}"
	always_load = no
}}
soundeffect = {{
	name = "effect_{name}"
	volume = 0.9
	sounds = {{
		sound = {name}
	}}
}}\n"""
    output.write(str)

# 2.生成示例：
# category = {
# 	name = "Voice"
# 	soundeffects = {
# 		effect_arona_menu_talk_00
# 		effect_arona_menu_talk_01
#         ...
# 	}
# }

effects = "\n\t\t".join([f"effect_{os.path.splitext(name)[0]}" for name in wav_files])
category = f"""category = {{
	name = "Voice"
	soundeffects = {{
		{effects}
	}}
}}"""
output.write(category)
output.close()
