
/*
tabela pedido
id_situacao
    1 cadastrado
    2 pendente financerio
    3 confirmado
    4 concretizado
    5 cancelado
    6 devolvido

id_nota_fiscal

id_estoque
    1 não foi dado baixa
    2 baixa parcial
    3 foi dado baixa 

id_nota_fiscal
    1 não foi emitida 

    2 foi emitida
*/

// PEDIDOS COM NOTA FISCAL NÃO EMITIDA E NÃO BAIXADOS SUPRA
/*     
    select bi_cadastro_clientes.Nome_Razão_Social , pedido.codigo 
    from pedido
    inner join bi_cadastro_clientes
    on clifor_codigo=bi_cadastro_clientes.Código and
    id_nota_fiscal='3' and id_estoque='1' and  (id_situacao='3' or id_situacao='4')
*/

// PEDIDOS COM NOTA FISCAL NÃO EMITIDA E NÃO BAIXADOS BLING

// pedidos_pendente
/*
UPDATE PEDIDO
SET ID_SITUACAO = 
WHERE CODIGO =


ONDE: 
1 = CADASTRADO
2 = PENDENTE FINANCEIRO
3 = CONFIRMADO
4 = CONCRETIZADO
5 = CANCELADO
6 = DEVOLVIDO
7 = ALVARÁ PENDENTE

UPDATE NOTA_FISCAL_VENDA
SET ID_SITUACAO_NFE = 1
WHERE NUMERO_NOTA =168310
AND SERIE= 99

ONDE:
1 = EM DIGITAÇÃO
2 = ASSINADA
3 = EM PROCESSAMENTO
4 = AUTORIZADA
5 = REJEITADA
6 = CANCELADA
7 = USO DENEGADO
8 = NUMERO INUTILIZADO

UPDATE NOTA_FISCAL_VENDA
SET SITUACAO = 1
WHERE NUMERO_NOTA =168310
AND SERIE= 99

Onde:
1 – EMITIDA
2 – TRANSMITIDA
3 – CANCELADA1
4 – INUTILIZADA 
5 – USO DENEGADO
*/

/*Retorna os pedidos com nota fiscal 
/*
    select pedido.codigo, bi_cadastro_clientes.Nome_Razão_Social
    from pedido
    inner join
        pedido_nota_fiscal
    on
        pedido_nota_fiscal.ped_codigo=pedido.codigo and 
        pedido.data > '2022-01-01' and
        id_estoque<>'3' and
        (pedido.id_situacao='3' or pedido.id_situacao='4')

    INNER JOIN 
        [SGC].[dbo].bi_cadastro_clientes

    on
        clifor_codigo=bi_cadastro_clientes.Código
        order by 1 desc

*/

/*
SELECT 
  t1.codigoPedido Numero,
  t1.codigocliente Cod_Cliente,
  cliente_fornecedor.nome Nome_Cliente,
  t1.data Data_Emissao,
  month(t1.data) Mes_Emissao,
  year(t1.data) Ano_Emissao,
  t1.data_entrega Data_Entrega,
  t1.Condicao_de_Pagamento Condicao_Pagamento,
  t1.Forma_de_Cobranca Forma_Cobranca,
  t1.codigoProduto Cod_Produto,
  t1.descricaoProduto Produto,
  t1.Principio_Ativo,
  t1.unid_unidade_comercializacao Und,
  t1.quantidade_comercializacao  Qtd_Pedido,
  t1.qtd_baixada Qnt_Baixada,
  t1.qtd_emitida_nf Qtd_Emitida,
  (t1.quantidade_comercializacao - t1.qtd_baixada) Qtd_Pendente_Baixa,
  (t1.qtd_baixada - t1.qtd_emitida_nf) Qtd_Baixada_Sem_Nota,
  convert(decimal(10,2),t1.valor_unitario_comercializacao) as Vlr_Unitario,
  convert(decimal(10,2),(t1.quantidade_comercializacao * t1.valor_unitario_comercializacao)) as Vlr_Total_Unit,
  convert(decimal(10,2),((t1.quantidade_comercializacao - t1.qtd_emitida_nf) * t1.valor_unitario_comercializacao)) as Vlr_Total_Pend_Nota,
  convert(decimal(10,2),((t1.qtd_baixada- t1.qtd_emitida_nf) * t1.valor_unitario_comercializacao)) as Vlr_Baixado_Pend_Nota,
  t1.Classif_Produto,
  case t1.id_pedido_empenho
		when 1 then 'PEDIDO'
		when 2 then 'EMPENHO'
        else NULL end as Pedido_Empenho,
  t1.fabricante Fabricante,
  t1.nomeVendedor Vendedor,
  t1.nomeCidadeCliente Cidade,
  t1.ufCliente UF,
  t1.nomeTipoPedido Tipo_Pedido,
  t1.Num_Processo Num_Processo,
  t1.Num_Secundario Num_Secundario
FROM (SELECT 
		Pedido.Codigo As codigoPedido,
		Pedido.CliFor_Codigo As codigoCliente,
		Pedido.data,
		condicao_pagamento.nome Condicao_de_Pagamento,
        cobranca.nome Forma_de_Cobranca,
		Pedido_Item.Prod_Codigo As codigoProduto,  
		CAST(IsNull(Pedido_Item.Descricao, Produto.nome) As NVarChar) As descricaoProduto, 
		principio_ativo.NOME Principio_Ativo,
		Pedido_Item.unid_unidade_comercializacao,
		Pedido_Item.quantidade_comercializacao,
		(SELECT ISNULL(SUM(nfvipi.quantidade),0) FROM nota_fiscal_venda_item_pedido_item nfvipi 
		WHERE nfvipi.pedit_ped_codigo = pedido_item.ped_codigo AND nfvipi.pedit_codigo = pedido_item.codigo) AS qtd_emitida_nf,
		Pedido_Item.valor_unitario_comercializacao,
		claspro.nome as Classif_Produto,
		Pedido.id_pedido_empenho,
		Fabricante.Nome As fabricante, 		
		(SELECT nome FROM vendedor WHERE codigo = Pedido.Vend_codigo) as nomeVendedor,
		(SELECT nome FROM cidade WHERE codigo = (SELECT cid_codigo FROM cliente_fornecedor WHERE codigo = Pedido.CliFor_Codigo)) as nomeCidadeCliente,
		(SELECT uf_sigla FROM cliente_fornecedor WHERE codigo = Pedido.CliFor_Codigo) as ufCliente,
		tipo_pedido.nome as nomeTipoPedido,
		Pedido.Vend_Codigo As codigoVendedor,
		case 
		when Pedido_Item.unid_unidade_comercializacao <> produto.unid_unidade 
		then 
		(SELECT ISNULL((SUM(Esm.quantidade)),0)/produto_unidade_conversao.multiplicador FROM Entrada_Saida_Mercadoria Esm 
		WHERE Esm.Pedit_Ped_Codigo = pedido_item.ped_codigo AND Esm.Pedit_Codigo = pedido_item.codigo
		and Pedido_Item.unid_unidade_comercializacao = produto_unidade_conversao.unidade_convertida
		) 
		else 
		(SELECT ISNULL((SUM(Esm.quantidade)),0) FROM Entrada_Saida_Mercadoria Esm 
		WHERE Esm.Pedit_Ped_Codigo = pedido_item.ped_codigo AND Esm.Pedit_Codigo = pedido_item.codigo		
		)
		end
		AS qtd_baixada,
		Pedido.data_entrega,
		pedido.numero_pedido_cliente Num_Processo,
		pedido.numero_secundario Num_Secundario
       
      FROM 
      Pedido 
      CROSS JOIN auxiliar  
      INNER JOIN Pedido_Item On Pedido_Item.Ped_Codigo = Pedido.Codigo 
      INNER JOIN Produto On Produto.Codigo = Pedido_Item.Prod_Codigo 
      LEFT  JOIN Fabricante On Fabricante.Codigo = Produto.Fabr_Codigo 
      left join condicao_pagamento on condicao_pagamento.codigo = pedido.condpg_codigo
      left join cobranca on cobranca.codigo = pedido.cob_codigo
      left join PRINCIPIO_ATIVO principio_ativo on principio_ativo.codigo = produto.pati_codigo
	  left join classificacao_produto as claspro on claspro.codigo = produto.claspro_codigo_1
      INNER JOIN tipo_pedido On pedido.tipoped_codigo = tipo_pedido.codigo 
	         AND tipo_pedido.id_entrada_saida = 2 
	  LEFT JOIN tipo_nota_fiscal on tipo_nota_fiscal.codigo = tipo_pedido.tipoNF_codigo
	  JOIN entrada_saida_mercadoria on entrada_saida_mercadoria.pedit_ped_codigo = pedido_item.ped_codigo
	  left join produto_unidade_conversao on produto_unidade_conversao.prod_codigo = produto.codigo 
	  and Pedido_Item.unid_unidade_comercializacao = produto_unidade_conversao.unidade_convertida
      WHERE 
        Pedido.ID_Situacao In (3) 
        AND Produto.Ind_Produto = 1 
        AND Produto.Data_Exclusao IS NULL 
        AND(Produto.Ind_Ativo_Venda = 1 OR Produto.Ind_Ativo_Nota_Fiscal = 1) 
        AND pedido.codigo in (select pedit_ped_codigo 
		                     from entrada_saida_mercadoria 
							 where pedit_ped_codigo is not null) 
		AND entrada_saida_mercadoria.pedit_codigo = pedido_item.codigo

      UNION 

      SELECT 
        Pedido.Codigo As codigoPedido,
		Pedido.CliFor_Codigo As codigoCliente,
		Pedido.data,
		condicao_pagamento.nome Condicao_de_Pagamento,
        cobranca.nome Forma_de_Cobranca,
		Pedido_Item.Prod_Codigo As codigoProduto,  
		CAST(IsNull(Pedido_Item.Descricao, Produto.nome) As NVarChar) As descricaoProduto, 
		principio_ativo.NOME Principio_Ativo,
		Pedido_Item.unid_unidade_comercializacao,
		Pedido_Item.quantidade_comercializacao,
		(SELECT ISNULL(SUM(nfvipi.quantidade),0) FROM nota_fiscal_venda_item_pedido_item nfvipi WHERE nfvipi.pedit_ped_codigo = pedido_item.ped_codigo AND nfvipi.pedit_codigo = pedido_item.codigo) AS qtd_emitida_nf,
		Pedido_Item.valor_unitario_comercializacao,
		claspro.nome as Classif_Produto,
		Pedido.id_pedido_empenho,
		Fabricante.Nome As fabricante, 
		(SELECT nome FROM vendedor WHERE codigo = Pedido.Vend_codigo) as nomeVendedor,
		(SELECT nome FROM cidade WHERE codigo = (SELECT cid_codigo FROM cliente_fornecedor WHERE codigo = Pedido.CliFor_Codigo)) as nomeCidadeCliente,
		(SELECT uf_sigla FROM cliente_fornecedor WHERE codigo = Pedido.CliFor_Codigo) as ufCliente,
		tipo_pedido.nome as nomeTipoPedido,
		Pedido.Vend_Codigo As codigoVendedor,

		case 
		when Pedido_Item.unid_unidade_comercializacao <> produto.unid_unidade 
		then 
		(SELECT ISNULL((SUM(Esm.quantidade)),0)/produto_unidade_conversao.multiplicador FROM Entrada_Saida_Mercadoria Esm 
		WHERE Esm.Pedit_Ped_Codigo = pedido_item.ped_codigo AND Esm.Pedit_Codigo = pedido_item.codigo
		and Pedido_Item.unid_unidade_comercializacao = produto_unidade_conversao.unidade_convertida
		) 
		else 
		(SELECT ISNULL((SUM(Esm.quantidade)),0) FROM Entrada_Saida_Mercadoria Esm 
		WHERE Esm.Pedit_Ped_Codigo = pedido_item.ped_codigo AND Esm.Pedit_Codigo = pedido_item.codigo		
		)
		end
		AS qtd_baixada,
		Pedido.data_entrega,
		pedido.numero_pedido_cliente Num_Processo,
		pedido.numero_secundario Num_Secundario

      FROM 
      Pedido 
	  CROSS JOIN auxiliar 
      INNER JOIN Pedido_Item On Pedido_Item.Ped_Codigo = Pedido.Codigo 
      INNER JOIN Produto     On Produto.Codigo         = Pedido_Item.Prod_Codigo 
      LEFT  JOIN Fabricante  On Fabricante.Codigo      = Produto.Fabr_Codigo 
      left join condicao_pagamento on condicao_pagamento.codigo = pedido.condpg_codigo
      left join cobranca on cobranca.codigo = pedido.cob_codigo
      left join PRINCIPIO_ATIVO principio_ativo on principio_ativo.codigo = produto.pati_codigo
	  left join classificacao_produto as claspro on claspro.codigo = produto.claspro_codigo_1
      INNER JOIN tipo_pedido ON pedido.tipoped_codigo  = tipo_pedido.codigo 
	         AND tipo_pedido.id_entrada_saida = 2 
	  LEFT JOIN tipo_nota_fiscal on tipo_nota_fiscal.codigo = tipo_pedido.tipoNF_codigo	
	  JOIN entrada_saida_mercadoria on entrada_saida_mercadoria.pedit_ped_codigo = pedido_item.ped_codigo
	  left join produto_unidade_conversao on produto_unidade_conversao.prod_codigo = produto.codigo and Pedido_Item.unid_unidade_comercializacao = produto_unidade_conversao.unidade_convertida
      WHERE 
        Pedido.ID_Situacao In (3) 
      AND Produto.Ind_Produto = 1 
      AND Produto.Data_Exclusao IS NULL 
      AND(Produto.Ind_Ativo_Venda = 1 OR Produto.Ind_Ativo_Nota_Fiscal = 1) 
	  AND entrada_saida_mercadoria.pedit_codigo = pedido_item.codigo
      AND pedido.codigo in(select pedit_ped_codigo 
	                       from entrada_saida_mercadoria 
						   where pedit_ped_codigo is not null)) t1 
	  INNER JOIN CLIENTE_FORNECEDOR ON T1.codigocliente = CLIENTE_FORNECEDOR.CODIGO 
      LEFT  JOIN VENDEDOR ON T1.CODIGOVENDEDOR = VENDEDOR.CODIGO 
	  
      WHERE 
	    t1.qtd_baixada > 0 
		AND (t1.qtd_baixada - t1.qtd_emitida_nf) > 0  

	  UNION 

      SELECT 
	  t1.codigoPedido Numero,
	  t1.codigocliente Cod_Cliente,
	  cliente_fornecedor.nome Nome_Cliente,
	  t1.data Data_Emissao,
	  month(t1.data) Mes_Emissao,
	  year(t1.data) Ano_Emissao,
	  t1.data_entrega Data_Entrega,
	  t1.Condicao_de_Pagamento Condicao_Pagamento,
	  t1.Forma_de_Cobranca Forma_Cobranca,
	  t1.codigoProduto Cod_Produto,
	  t1.descricaoProduto Produto,
	  t1.Principio_Ativo,
	  t1.unidade Und,
	  t1.quantidade Qtd_Pedido,
	   t1.qtd_baixada Qnt_Baixada,
	  t1.qtd_emitida_nf Qtd_Emitida,
	  (t1.quantidade - t1.qtd_baixada) Qtd_Pendente_Baixa,
	  (t1.qtd_baixada - t1.qtd_emitida_nf) Qtd_Baixada_Sem_Nota,
	  convert(decimal(10,2),t1.valor_unitario) as Vlr_Unitario,
	  convert(decimal(10,2),(t1.quantidade * t1.valor_unitario)) as Vlr_Total_Unit,
	  convert(decimal(10,2),((t1.quantidade - t1.qtd_emitida_nf) * t1.valor_unitario)) as Vlr_Total_Pend_Nota,
	  convert(decimal(10,2),((t1.qtd_baixada- t1.qtd_emitida_nf) * t1.valor_unitario)) as Vlr_Baixado_Pend_Nota,
	  t1.Classif_Produto,
	  case t1.id_pedido_empenho
			when 1 then 'PEDIDO'
			when 2 then 'EMPENHO'
			else NULL end as Pedido_Empenho,
	  t1.fabricante Fabricante,
	  t1.nomeVendedor Vendedor,
	  t1.nomeCidadeCliente Cidade,
	  t1.ufCliente UF,
	  t1.nomeTipoPedido Tipo_Pedido,
	  t1.Num_Processo,
	  t1.Num_Secundario Num_Secundario

       FROM (SELECT 
        Pedido.Codigo As codigoPedido,
		Pedido.CliFor_Codigo As codigoCliente,
		Pedido.data,
		condicao_pagamento.nome Condicao_de_Pagamento,
        cobranca.nome Forma_de_Cobranca,
		pedido_item_servico.Prod_Codigo As codigoProduto,  
		CAST(IsNull(pedido_item_servico.Descricao, Produto.nome) As NVarChar) As descricaoProduto, 
		principio_ativo.NOME Principio_Ativo,
		pedido_item_servico.unidade,
		pedido_item_servico.quantidade,
		(SELECT ISNULL(SUM(nfvipi.quantidade),0) FROM nota_fiscal_venda_item_pedido_item nfvipi WHERE nfvipi.pedit_ped_codigo = Pedido_Item_servico.ped_codigo AND nfvipi.pedit_codigo = Pedido_Item_servico.codigo) AS qtd_emitida_nf,
		Pedido_Item_servico.valor_unitario,
		claspro.nome as Classif_Produto,
		Pedido.id_pedido_empenho,
		Fabricante.Nome As fabricante, 
		(SELECT nome FROM vendedor WHERE codigo = Pedido.Vend_codigo) as nomeVendedor,
		(SELECT nome FROM cidade WHERE codigo = (SELECT cid_codigo FROM cliente_fornecedor WHERE codigo = Pedido.CliFor_Codigo)) as nomeCidadeCliente,
		(SELECT uf_sigla FROM cliente_fornecedor WHERE codigo = Pedido.CliFor_Codigo) as ufCliente,
		tipo_pedido.nome as nomeTipoPedido,
		Pedido.Vend_Codigo As codigoVendedor,
		case 
		when Pedido_Item_servico.unidade <> produto.unid_unidade 
		then 
		(SELECT ISNULL((SUM(Esm.quantidade)),0)/produto_unidade_conversao.multiplicador FROM Entrada_Saida_Mercadoria Esm 
		WHERE Esm.Pedit_Ped_Codigo = Pedido_Item_servico.ped_codigo AND Esm.Pedit_Codigo = Pedido_Item_servico.codigo
		and Pedido_Item_servico.unidade = produto_unidade_conversao.unidade_convertida
		) 
		else 
		(SELECT ISNULL((SUM(Esm.quantidade)),0) FROM Entrada_Saida_Mercadoria Esm 
		WHERE Esm.Pedit_Ped_Codigo = Pedido_Item_servico.ped_codigo AND Esm.Pedit_Codigo = Pedido_Item_servico.codigo		
		)
		end
		AS qtd_baixada,
		Pedido.data_entrega,
		pedido.numero_pedido_cliente Num_Processo,
		pedido.numero_secundario Num_Secundario
       FROM 
         Pedido 
	   CROSS JOIN auxiliar 
       INNER JOIN Pedido_Item_Servico On Pedido_Item_Servico.Ped_Codigo = Pedido.Codigo 
       INNER JOIN Produto On Produto.Codigo = Pedido_Item_Servico.Prod_Codigo 
       LEFT  JOIN Fabricante On Fabricante.Codigo = Produto.Fabr_Codigo 
       left join condicao_pagamento on condicao_pagamento.codigo = pedido.condpg_codigo
       left join cobranca on cobranca.codigo = pedido.cob_codigo
       left join PRINCIPIO_ATIVO principio_ativo on principio_ativo.codigo = produto.pati_codigo
	   left join classificacao_produto as claspro on claspro.codigo = produto.claspro_codigo_1
       INNER JOIN tipo_pedido ON pedido.tipoped_codigo = tipo_pedido.codigo 
	          AND tipo_pedido.id_entrada_saida = 2 
		LEFT JOIN tipo_nota_fiscal on tipo_nota_fiscal.codigo = tipo_pedido.tipoNF_codigo 
		JOIN entrada_saida_mercadoria on entrada_saida_mercadoria.pedit_ped_codigo = Pedido_Item_Servico.ped_codigo
		left join produto_unidade_conversao on produto_unidade_conversao.prod_codigo = produto.codigo 
		and Pedido_Item_Servico.unidade = produto_unidade_conversao.unidade_convertida

       WHERE 
         Pedido.ID_Situacao In (3) 
         AND Produto.Ind_Servico = 1 
         AND Produto.Data_Exclusao IS NULL 
         AND(Produto.Ind_Ativo_Venda = 1 OR Produto.Ind_Ativo_Nota_Fiscal = 1) 
         AND pedido.codigo in (select pedit_ped_codigo 
		                      from entrada_saida_mercadoria 
		                      where pedit_ped_codigo is not null) 
       ) t1 
INNER JOIN CLIENTE_FORNECEDOR ON T1.codigocliente = CLIENTE_FORNECEDOR.CODIGO 
LEFT  JOIN VENDEDOR ON T1.CODIGOVENDEDOR = VENDEDOR.CODIGO 
WHERE 
  t1.qtd_baixada > 0 
  AND (t1.qtd_baixada - t1.qtd_emitida_nf) > 0 

*/


/*
	CREATE VIEW produtos_pendentes AS

	IF EXISTS (SELECT TABLE_NAME FROM INFORMATION_SCHEMA.VIEWS
         WHERE TABLE_NAME = 'bi_pedidos_pendentes')
   DROP VIEW bi_pedidos_pendentes
GO
CREATE  view [dbo].[bi_pedidos_pendentes] as 


SELECT pedido.codigo as Pedido, 
       pedido.data, pedido.data_entrega as DataEntrega,
      (produto.quantidade_estoque / isnull(puc.multiplicador,1)) as QtdEstoque,
      ((produto.quantidade_estoque * isnull(puc.multiplicador,1)) * (produto.preco_custo * isnull(puc.multiplicador,1))) as VrEstoque,
      (produto.preco_custo * isnull(puc.multiplicador,1)) as PrecoCusto,
      Frete = case pedido.id_frete 
               when 1 then 'CIF'
			   when 2 then 'FOB'
			   when 3 then 'TERCEIROS'
			   else 'SEM FRETE' end,
	  pedido.clifor_codigo as CodCliente, 
	  pedido_item.prod_codigo as CodProduto,
	  produto.nome as Produto, 
	  PRINCIPIO_ATIVO.nome as PrincipioAtivo,
	  pedido_item.codigo AS item, 
	  pedido_item.quantidade_comercializacao as Quantidade, 
	  pedido_item.valor_unitario VrUnitario, 
	  (pedido_item.quantidade - ISNULL(SUM(entrada_saida_mercadoria.quantidade),0)) / isnull(puc.multiplicador,1) AS QtdPendente, 
	  round(pedido_item.valor_unitario * (pedido_item.quantidade - ISNULL(SUM(entrada_saida_mercadoria.quantidade), 0)),2)as 
      valorPedente,cliente_fornecedor.nome, 1 as ProdutoServico, 
	  dateDiff(day,getdate(), pedido.data_entrega)  as DiasAtraso, 
	  cidade.nome as CidadeEntrega, 
	  unid_unidade_comercializacao as UndComercializacao
FROM pedido   
	  LEFT JOIN vendedor ON vendedor.codigo = pedido.vend_codigo 
	  INNER JOIN pedido_item ON pedido_item.ped_codigo = pedido.codigo  
	  LEFT OUTER JOIN entrada_saida_mercadoria ON entrada_saida_mercadoria.pedit_codigo = pedido_item.codigo 
	  AND entrada_saida_mercadoria.pedit_ped_codigo = pedido_item.ped_codigo 
	  AND entrada_saida_mercadoria.prod_codigo = pedido_item.prod_codigo 
	  INNER JOIN cliente_fornecedor ON pedido.clifor_codigo = cliente_fornecedor.codigo 
	  INNER JOIN produto ON pedido_item.prod_codigo = produto.codigo 
	  LEFT JOIN cidade on cidade.codigo = pedido.cid_codigo_entrega  
	  left join produto_unidade_conversao puc on puc.prod_codigo = pedido_item.prod_codigo  
	  and pedido_item.unid_unidade_comercializacao = puc.unidade_convertida 
	  left join PRINCIPIO_ATIVO on PRINCIPIO_ATIVO.codigo = produto.pati_codigo 
WHERE  pedido.tipoped_codigo 
      in (select codigo from tipo_pedido where id_entrada_saida = 2)  
	  and IsNull(pedido.id_estoque, 1) <> 3  and pedido_item.prod_codigo <> '999999'  
	  and pedido.data between '01/01/2018' and '01/01/3050'
	  GROUP BY pedido.codigo, 
	  pedido.clifor_codigo, 
	  cliente_fornecedor.nome,
	  produto.quantidade_estoque,
	  produto.preco_custo,
	  pedido.data, 
	  pedido.data_entrega, 
	  pedido_item.prod_codigo, 
	  produto.nome, 
	  PRINCIPIO_ATIVO.nome,
	  cidade.nome,
	  pedido.id_frete, 
	  quantidade_comercializacao, 
	  pedido_item.codigo, 
	  pedido_item.quantidade, 
	  pedido_item.valor_unitario, 
	  unid_unidade_comercializacao, 
	  puc.multiplicador 
	  HAVING round(pedido_item.quantidade - ISNULL(SUM(entrada_saida_mercadoria.quantidade), 0), 2) > 0 
 order by Pedido.codigo 

 GO


GRANT SELECT ON [dbo].[bi_pedidos_pendentes] TO [DW]
GO



*/

/****** Script do comando SelectTopNRows de SSMS  ******/
/*SELECT TOP (1000) 
	[codigo],
	[data],
    [id_situacao],
	[id_estoque],
	[id_nota_fiscal],
	[data_ultima_alteracao]
      
FROM [SGC].[dbo].[pedido]

WHERE 
	[SGC].[dbo].[pedido].[id_situacao] = 3 and
	[SGC].[dbo].[pedido].[id_estoque] = 1 and
	[SGC].[dbo].[pedido].[tipoped_codigo] <> 9 and
	[data] > '01/01/2022'

ORDER BY [codigo] DESC
*/