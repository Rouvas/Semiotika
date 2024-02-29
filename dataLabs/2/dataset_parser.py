def idk(file='dataset.xlsx'):
    import pandas, json, random
    from math import nan
    xls = pandas.ExcelFile(file)
    df = xls.parse(xls.sheet_names[0])
    df = df.transpose().to_dict()
    for k, v in df.copy().items():
        if 'Touch_Screen' in v: v['Touch_Screen'] = 'Yes' if v['Touch_Screen'] == 'Yes' else 'No'
        if 'UEFI' in v: v['UEFI'] = 'Yes' if v['UEFI'] == 'Yes' else 'No'
        if 'Face_Unlock' in v: v['Face_Unlock'] = 'Yes' if v['Face_Unlock'] == 'Yes' else 'No'
        if 'Sensor' in v: v['Sensor'] = 'Yes' if v['Sensor'] == 'Yes' else 'No'
        if 'Touch_ID' in v: v['Touch_ID'] = 'Yes' if v['Touch_ID'] == 'Yes' else 'No'
        if 'HDMI' in v: v['HDMI'] = 'Yes' if v['HDMI'] == 'Yes' else 'No'
        if 'USB-C_Charging' in v: v['USB-C_Charging'] = 'Yes' if v['USB-C_Charging'] == 'Yes' else 'No'
        if 'USB-C_Display' in v: v['USB-C_Display'] = 'Yes' if v['USB-C_Display'] == 'Yes' else 'No'
        if 'Thunderbolt_3' in v: v['Thunderbolt_3'] = 'Yes' if v['Thunderbolt_3'] == 'Yes' else 'No'
        if 'Thunderbolt_4' in v: v['Thunderbolt_4'] = 'Yes' if v['Thunderbolt_4'] == 'Yes' else 'No'
        if 'Ethernet' in v: v['Ethernet'] = 'Yes' if v['Ethernet'] == 'Yes' else 'No'
        if '3.5mm_Jack' in v: v['3.5mm_Jack'] = 'Yes' if v['3.5mm_Jack'] == 'Yes' else 'No'
        if 'Screen_Size' in v:
            v['Screen_Size'] = '10' if v['Screen_Size'] == 10 \
                else '11' if v['Screen_Size'] == 11 \
                else '12' if v['Screen_Size'] == 12 \
                else '13' if v['Screen_Size'] == 13 \
                else '14' if v['Screen_Size'] == 14 \
                else '15' if v['Screen_Size'] == 15 \
                else '16' if v['Screen_Size'] == 16 \
                else '17' if v['Screen_Size'] == 17 \
                else '18'
        if 'Keyboard_Type' in v:
            v['Keyboard_Type'] = 'Membrane' if v['Keyboard_Type'] == 'Membrane' \
                else 'Scissor' if v['Keyboard_Type'] == 'Scissor' \
                else 'Mechanical'
        if 'Keyboard_Light' in v: v['Keyboard_Light'] = 'Yes' if v['Keyboard_Light'] == 'Yes' else 'No'
        if 'Keyboard_SoftButtons' in v: v['Keyboard_SoftButtons'] = 'Yes' if v['Keyboard_SoftButtons'] == 'Yes' else 'No'
        if 'CPU_Brand' in v:
            v['CPU_Brand'] = 'Intel' if v['CPU_Brand'] == 'Intel' \
                else 'AMD' if v['CPU_Brand'] == 'AMD' \
                else 'Apple' if v['CPU_Brand'] == 'Apple' \
                else 'Qualcomm' if v['CPU_Brand'] == 'Qualcomm' \
                else 'MediaTek'
        if 'CPU_Model' in v:
            v['CPU_Model'] = 'Core i7' if v['CPU_Model'] == 'Core i7' \
                else 'Core i5' if v['CPU_Model'] == 'Core i5' \
                else 'Ryzen' if v['CPU_Model'] == 'Ryzen' \
                else 'Core i3' if v['CPU_Model'] == 'Core i3' \
                else 'Celeron' if v['CPU_Model'] == 'Celeron' \
                else 'Core i9' if v['CPU_Model'] == 'Core i9' \
                else 'Pentium' if v['CPU_Model'] == 'Pentium' \
                else 'Snapdragon' if v['CPU_Model'] == 'Snapdragon' \
                else 'M2' if v['CPU_Model'] == 'M2' \
                else 'Atom' if v['CPU_Model'] == 'Atom' \
                else 'M1' if v['CPU_Model'] == 'M1' \
                else 'M1 Max' if v['CPU_Model'] == 'M1 Max' \
                else 'M1 Pro' if v['CPU_Model'] == 'M1 Pro' \
                else 'M2 Pro' if v['CPU_Model'] == 'M2 Pro' \
                else 'M3 Max' if v['CPU_Model'] == 'M3 Max' \
                else 'M3 Pro' if v['CPU_Model'] == 'M3 Pro' \
                else 'MT8183' if v['CPU_Model'] == 'MT8183' \
                else 'Helio P60T' if v['CPU_Model'] == 'Helio P60T' \
                else 'Core m3'
        if 'Core_Count' in v:
            v['Core_Count'] = '8' if v['Core_Count'] == 8 \
                else '4' if v['Core_Count'] == 4 \
                else '2' if v['Core_Count'] == 2 \
                else '6' if v['Core_Count'] == 6 \
                else '10' if v['Core_Count'] == 10 \
                else '12' if v['Core_Count'] == 12 \
                else '14' if v['Core_Count'] == 14 \
                else '16' if v['Core_Count'] == 16 \
                else '11'
        if 'RAM_Capacity' in v:
            v['RAM_Capacity'] = '4' if v['RAM_Capacity'] == 4 \
                else '6' if v['RAM_Capacity'] == 6 \
                else '8' if v['RAM_Capacity'] == 8 \
                else '16' if v['RAM_Capacity'] == 16 \
                else '18' if v['RAM_Capacity'] == 18 \
                else '32' if v['RAM_Capacity'] == 32 \
                else '48' if v['RAM_Capacity'] == 48 \
                else '64'
        if 'RAM_Max' in v:
            v['RAM_Max'] = '4' if v['RAM_Max'] == 4 \
                else '6' if v['RAM_Max'] == 6 \
                else '8' if v['RAM_Max'] == 8 \
                else '16' if v['RAM_Max'] == 16 \
                else '18' if v['RAM_Max'] == 18 \
                else '32' if v['RAM_Max'] == 32 \
                else '48' if v['RAM_Max'] == 48 \
                else '64'
        if 'RAM_Type' in v:
            v['RAM_Type'] = 'DDR3' if v['RAM_Type'] == 'DDR3' \
                else 'DDR4' if v['RAM_Type'] == 'DDR4' \
                else 'DDR5'
        if 'Release' in v:
            v['Release'] = 2018 if v['Release'] == 2018 \
                else '2019' if v['Release'] == 2019 \
                else '2020' if v['Release'] == 2020 \
                else '2021' if v['Release'] == 2021 \
                else '2022' if v['Release'] == 2022 \
                else '2023'
        if 'RAM_Slots' in v:
            v['RAM_Slots'] = 0 if v['RAM_Slots'] == 0 \
                else '1' if v['RAM_Slots'] == 1 \
                else '2' if v['RAM_Slots'] == 2 \
                else '3' if v['RAM_Slots'] == 3 \
                else '4'
        if 'Resolution' in v:
            v['Resolution'] = 'HD' if v['Resolution'] == 'HD' \
                else 'FULL HD' if v['Resolution'] == 'FULL HD' \
                else '2K' if v['Resolution'] == '2K' \
                else '4K'
        if 'GPU_Brand' in v:
            v['GPU_Brand'] = 'Intel' if v['GPU_Brand'] == 'Intel' \
                else 'NVIDIA' if v['GPU_Brand'] == 'NVIDIA' \
                else 'AMD' if v['GPU_Brand'] == 'AMD' \
                else 'Apple' if v['GPU_Brand'] == 'Apple' \
                else 'ARM' if v['GPU_Brand'] == 'ARM' \
                else 'Qualcomm'
        if 'GPU_Model' in v:
            v['GPU_Model'] = 'Adreno 618' if v['GPU_Model'] == 'Adreno 618' \
                else 'Arc A370M' if v['GPU_Model'] == 'Arc A370M' \
                else 'GTX 1650' if v['GPU_Model'] == 'GTX 1650' \
                else 'GTX 1650 Ti' if v['GPU_Model'] == 'GTX 1650 Ti' \
                else 'HD 400' if v['GPU_Model'] == 'HD 400' \
                else 'Iris' if v['GPU_Model'] == 'Iris' \
                else 'M1' if v['GPU_Model'] == 'M1' \
                else 'M1 Max' if v['GPU_Model'] == 'M1 Max' \
                else 'M1 Pro' if v['GPU_Model'] == 'M1 Pro' \
                else 'M2' if v['GPU_Model'] == 'M2' \
                else 'M2 Pro' if v['GPU_Model'] == 'M2 Pro' \
                else 'M3 Max' if v['GPU_Model'] == 'M3 Max' \
                else 'M3 Pro' if v['GPU_Model'] == 'M3 Pro' \
                else 'Mali-G72' if v['GPU_Model'] == 'Mali-G72' \
                else 'MX350' if v['GPU_Model'] == 'MX350' \
                else 'Quadro' if v['GPU_Model'] == 'Quadro' \
                else 'Radeon' if v['GPU_Model'] == 'Radeon' \
                else 'Radeon 780M' if v['GPU_Model'] == 'Radeon 780M' \
                else 'Radeon Pro 5500M' if v['GPU_Model'] == 'Radeon Pro 5500M' \
                else 'Radeon RX 6700S' if v['GPU_Model'] == 'Radeon RX 6700S' \
                else 'Radeon RX 7600M XT' if v['GPU_Model'] == 'Radeon RX 7600M XT' \
                else 'Radeon RX 7600S' if v['GPU_Model'] == 'Radeon RX 7600S' \
                else 'Radeon RX Vega 6' if v['GPU_Model'] == 'Radeon RX Vega 6' \
                else 'Radeon Vega 9' if v['GPU_Model'] == 'Radeon Vega 9' \
                else 'RTX 2050' if v['GPU_Model'] == 'RTX 2050' \
                else 'RTX 2080 SUPER' if v['GPU_Model'] == 'RTX 2080 SUPER' \
                else 'RTX 3050' if v['GPU_Model'] == 'RTX 3050' \
                else 'RTX 3070 Ti' if v['GPU_Model'] == 'RTX 3070 Ti' \
                else 'RTX 3080 Ti' if v['GPU_Model'] == 'RTX 3080 Ti' \
                else 'RTX 4050' if v['GPU_Model'] == 'RTX 4050' \
                else 'RTX 4060' if v['GPU_Model'] == 'RTX 4060' \
                else 'RTX 4070' if v['GPU_Model'] == 'RTX 4070' \
                else 'RTX 4080' if v['GPU_Model'] == 'RTX 4080' \
                else 'RTX A1000' if v['GPU_Model'] == 'RTX A1000' \
                else 'RTX A2000' if v['GPU_Model'] == 'RTX A2000' \
                else 'RTX A3000' if v['GPU_Model'] == 'RTX A3000' \
                else 'UHD'
        if 'USB-C_Ports' in v:
            v['USB-C_Ports'] = '0' if v['USB-C_Ports'] == 0 \
                else '1' if v['USB-C_Ports'] == 1 \
                else '2' if v['USB-C_Ports'] == 2 \
                else '3' if v['USB-C_Ports'] == 3 \
                else '4'
        if 'Product_Brand' in v:
            v['Product_Brand'] = 'Lenovo' if v['Product_Brand'] == 'Lenovo' \
                else 'HP' if v['Product_Brand'] == 'HP' \
                else 'ASUS' if v['Product_Brand'] == 'ASUS' \
                else 'Dell' if v['Product_Brand'] == 'Dell' \
                else 'Acer' if v['Product_Brand'] == 'Acer' \
                else 'Apple' if v['Product_Brand'] == 'Apple' \
                else 'Microsoft' if v['Product_Brand'] == 'Microsoft' \
                else 'MSI' if v['Product_Brand'] == 'MSI' \
                else 'Framework' if v['Product_Brand'] == 'Framework' \
                else 'LG' if v['Product_Brand'] == 'LG' \
                else 'Razer' if v['Product_Brand'] == 'Razer' \
                else 'Thomson' if v['Product_Brand'] == 'Thomson' \
                else 'Samsung' if v['Product_Brand'] == 'Samsung' \
                else 'Google'
        if 'Refresh_Rate' in v:
            v['Refresh_Rate'] = '60' if v['Refresh_Rate'] == 60 \
                else '165' if v['Refresh_Rate'] == 165 \
                else '120' if v['Refresh_Rate'] == 120 \
                else '90' if v['Refresh_Rate'] == 90 \
                else '144' if v['Refresh_Rate'] == 144 \
                else '240' if v['Refresh_Rate'] == 240 \
                else '300' if v['Refresh_Rate'] == 300 \
                else '480'
        for k1, v1 in v.copy().items():
            if isinstance(v1, float):
                v.pop(k1)
            if isinstance(v1, str) and v1.lower() == 'yes':
                v[k1] = True
            elif isinstance(v1, str) and v1.lower() == 'no':
                v[k1] = False
        df[v['Product']] = df.pop(k)
        df[v['Product']].pop('Product')
        v['Price'] = int(random.triangular(5, 300, 60)) * 1000
        print(k)
    with open('dataset.json', 'w', encoding='utf8') as f:
        json.dump(json.loads(json.dumps(df)), f)


idk()
