<?php

//source https://stackoverflow.com/questions/10762538/how-to-select-randomly-with-doctrine

namespace App\DoctrineExtensions;
    
    use Doctrine\ORM\Query\AST\Functions\FunctionNode;
    use Doctrine\ORM\Query\Lexer;
    
    class Rand extends FunctionNode
    {
        public function getSql(\Doctrine\ORM\Query\SqlWalker $sqlWalker)
        {
            return 'RAND()';
        }
    
        public function parse(\Doctrine\ORM\Query\Parser $parser)
        {
            $parser->match(Lexer::T_IDENTIFIER);
            $parser->match(Lexer::T_OPEN_PARENTHESIS);
            $parser->match(Lexer::T_CLOSE_PARENTHESIS);
        }
    }