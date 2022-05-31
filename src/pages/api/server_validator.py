from time import time
import requests
import time
import os
import asyncio


async def sync_bling():
    os.startfile('C:/Users/paulo/OneDrive/Documentos/wms/teste/SVGanimado/src/pages/api/syncbling.py')

async def start_server():
    os.system('''cd C:/Users/paulo/OneDrive/Documentos/wms/teste/SVGanimado''')
    os.system("npm run dev")

def main():
    print('Starting...')
    while True:
        try:
            r = requests.get('http://localhost:3000/api/ping')
            if r.status_code == 200:
                print('Server is up!')
                asyncio.run(sync_bling())
                time.sleep(10)
            else:
                print('Server is down!')
                time.sleep(10)
        except:
            print('Server is down!')
            os.system("taskkill /f /im node.exe")

            for i in range(0, 5):
                print("Restarting SERVER... " + str(5-i))
                time.sleep(1)

            asyncio.run(start_server())
            asyncio.run(sync_bling())


asyncio.run(main())