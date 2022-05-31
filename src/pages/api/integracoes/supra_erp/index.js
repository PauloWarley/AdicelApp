import axios from "axios"

const HOST = process.env.HOST

export default async function Supra(req, res){

    // console.log("Supra", req.body.query)

    var query = req.body.query

	// console.log("Supra", req.query.pedido)

	if (req.query.pedido != undefined){
		query = `SELECT 
		[SGC].[dbo].[pedido].[codigo] as ID_pedido	, 
		Cliente.[nome] as Nome_do_contato, 
		concat( Cliente.tipo_logradouro, ' ', Cliente.logradouro ) as logradouro, 
		Cliente.numero as numero, 
		ISNULL(Cliente.complemento, '') AS complemento, 
		Cliente.bairro as bairro, 
		[SGC].[dbo].[cidade].[nome] as cidade, 
		Cliente.uf_sigla as uf_sigla,
		Cliente.cep as cep,
		ISNULL(Cliente.email, '') as email,
		FORMAT ([SGC].[dbo].[pedido].[data], 'yyyy-MM-dd')  as Data,
		CASE WHEN [SGC].[dbo].[pedido].[id_situacao] = 4 THEN 'Atendido' ELSE (CASE WHEN [SGC].[dbo].[pedido].[id_situacao] = 3  THEN 'Pendente' ELSE '' END) END AS Situacao,
		Transportadora.[nome] as Transportadora,
		[SGC].[dbo].[produto].codigo as ID_produto,
		[SGC].[dbo].[produto].[nome] as Descricao,
		[SGC].[dbo].[pedido_item].quantidade as Quantidade,
		[SGC].[dbo].[pedido_item].unidade as Unidade,
		[SGC].[dbo].[produto].[Codigo_barra] as GTIN,
		[SGC].[dbo].[pedido_item].[valor_unitario] as Valor_unitario,
		[SGC].[dbo].[nota_fiscal_venda].[numero_nota] as N_NFe
		
	
	FROM [SGC].[dbo].[pedido]
	
	INNER JOIN [SGC].[dbo].[cliente_fornecedor] as Cliente
	on
	
		Cliente.[codigo] =  [SGC].[dbo].[pedido].[clifor_codigo] and 
	
		[SGC].[dbo].[pedido].[data] > '01-01-2022' and	
	
		Cliente.[nome] <> 'ADICEL - INDUSTRIA E COMERCIO LTDA (FILIAL ECOMMERCE)'
	
	
	INNER JOIN [SGC].[dbo].[cliente_fornecedor] as Transportadora
	on
		Transportadora.[codigo] = [SGC].[dbo].[pedido].[tran_codigo] and 
	
		Transportadora.[nome] <> 'ADICEL - INDUSTRIA E COMERCIO LTDA (FILIAL ECOMMERCE)'		
	
	
	INNER JOIN [SGC].[dbo].[tipo_pedido]
	ON
		[SGC].[dbo].[tipo_pedido].[codigo] = [SGC].[dbo].[pedido].[tipoped_codigo] AND
		[SGC].[dbo].[pedido].[tipoped_codigo] <> 9
	
		
	INNER JOIN [SGC].[dbo].[pedido_item]
	ON
		[SGC].[dbo].[pedido].[codigo] = [SGC].[dbo].[pedido_item].[ped_codigo]
	
	INNER JOIN [SGC].[dbo].[produto]
	ON
		[SGC].[dbo].[produto].[codigo] = [SGC].[dbo].[pedido_item].[prod_codigo]
	
	INNER JOIN [SGC].[dbo].[cidade]
	ON
		Cliente.cid_codigo = [SGC].[dbo].[cidade].codigo
	
	LEFT JOIN [SGC].[dbo].[pedido_nota_fiscal]
	ON
		pedido_nota_fiscal.ped_codigo = pedido.codigo
	
	LEFT JOIN [SGC].[dbo].[nota_fiscal_venda]
	ON
		[SGC].[dbo].[pedido_nota_fiscal].nf_codigo = [SGC].[dbo].[nota_fiscal_venda].[codigo]
	
	WHERE [SGC].[dbo].[pedido].[codigo] = ${req.query.pedido}
	ORDER BY 1 DESC`
		
	}

	else{
		query = `SELECT 
			[SGC].[dbo].[pedido].[codigo] as ID_pedido	, 
			Cliente.[nome] as Nome_do_contato, 
			concat( Cliente.tipo_logradouro, ' ', Cliente.logradouro ) as logradouro, 
			Cliente.numero as numero, 
			ISNULL(Cliente.complemento, '') AS complemento, 
			Cliente.bairro as bairro, 
			[SGC].[dbo].[cidade].[nome] as cidade, 
			Cliente.uf_sigla as uf_sigla,
			Cliente.cep as cep,
			ISNULL(Cliente.email, '') as email,
			FORMAT ([SGC].[dbo].[pedido].[data], 'yyyy-MM-dd')  as Data,
			CASE WHEN [SGC].[dbo].[pedido].[id_situacao] = 4 THEN 'Atendido' ELSE (CASE WHEN [SGC].[dbo].[pedido].[id_situacao] = 3  THEN 'Pendente' ELSE '' END) END AS Situacao,
			Transportadora.[nome] as Transportadora,
			[SGC].[dbo].[produto].codigo as ID_produto,
			[SGC].[dbo].[produto].[nome] as Descricao,
			[SGC].[dbo].[pedido_item].quantidade as Quantidade,
			[SGC].[dbo].[pedido_item].unidade as Unidade,
			[SGC].[dbo].[produto].[Codigo_barra] as GTIN,
			[SGC].[dbo].[pedido_item].[valor_unitario] as Valor_unitario,
			[SGC].[dbo].[nota_fiscal_venda].[numero_nota] as N_NFe
		
		FROM [SGC].[dbo].[pedido]
		
		INNER JOIN [SGC].[dbo].[cliente_fornecedor] as Cliente
		on
		
			Cliente.[codigo] =  [SGC].[dbo].[pedido].[clifor_codigo] and 
		
			[SGC].[dbo].[pedido].[data] > '01-01-2022' and	
			Cliente.[nome] <> 'ADICEL - INDUSTRIA E COMERCIO LTDA (FILIAL ECOMMERCE)'
		
		
		INNER JOIN [SGC].[dbo].[cliente_fornecedor] as Transportadora
		on
			Transportadora.[codigo] = [SGC].[dbo].[pedido].[tran_codigo] and 
			Transportadora.[nome] <> 'ADICEL - INDUSTRIA E COMERCIO LTDA (FILIAL ECOMMERCE)'		
		
		
		INNER JOIN [SGC].[dbo].[tipo_pedido]
		ON
			[SGC].[dbo].[tipo_pedido].[codigo] = [SGC].[dbo].[pedido].[tipoped_codigo] AND
		
			[SGC].[dbo].[pedido].[id_situacao] = 3 and
			[SGC].[dbo].[pedido].[id_estoque] = 1 and
			[SGC].[dbo].[pedido].[tipoped_codigo] <> 9
		
			
		INNER JOIN [SGC].[dbo].[pedido_item]
		ON
			[SGC].[dbo].[pedido].[codigo] = [SGC].[dbo].[pedido_item].[ped_codigo]
		
		INNER JOIN [SGC].[dbo].[produto]
		ON
			[SGC].[dbo].[produto].[codigo] = [SGC].[dbo].[pedido_item].[prod_codigo]
		
		INNER JOIN [SGC].[dbo].[cidade]
		ON
			Cliente.cid_codigo = [SGC].[dbo].[cidade].codigo
		
		LEFT JOIN [SGC].[dbo].[pedido_nota_fiscal]
		ON
			pedido_nota_fiscal.ped_codigo = pedido.codigo
		LEFT JOIN [SGC].[dbo].[nota_fiscal_venda]
		ON
			[SGC].[dbo].[pedido_nota_fiscal].nf_codigo = [SGC].[dbo].[nota_fiscal_venda].[codigo]
		
		ORDER BY 1 DESC`
	}

    var response = (await axios.post(`${HOST}/api/integracoes/supra_erp/database`, {query: query})).data.recordsets[0]

	


    res.status(200).json(response)
}

